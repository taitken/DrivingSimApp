import cv2
import dotenv
import numpy as np
import csv
import os
import json 
import tkinter as tk
from tkinter import filedialog
import re
from datetime import datetime, timedelta
import pytz

# Note: 1. make sure to select the right calibration homography matrix file; 2. make sure the video was cropped right (sometimes top right, somtimes bottom left)

# Define constants
dotenv.load_dotenv()
CALIBRATION_DATA_PATH = os.getcwd() + os.getenv('CALIBRATION_DATA_PATH')
REAL_WORLD_POINTS_PATH = os.getcwd() + os.getenv('REAL_WORLD_POINTS_PATH')
OUTPUT_PATH = os.getcwd() + os.getenv('OUTPUT_PATH')

# Load video
def select_video_file():
    root = tk.Tk()
    root.withdraw()  # Hide the main window
    file_path = filedialog.askopenfilename(title="Select a Video File", filetypes=[("All Files", "*.*")])
    return file_path

print("Select the lane gopro video that you want to extract wheel-to-lane distance from.")
video_input_path = select_video_file()

# Dynamically construct the output paths
base_name = os.path.splitext(os.path.basename(video_input_path))[0]  # Extract the base name without extension
video_output_path = os.path.join(OUTPUT_PATH, f'{base_name}_output_video.mp4')
csv_output_path = os.path.join(OUTPUT_PATH, f'{base_name}_frame_data.csv')

# Ensure the 'output' directory exists
os.makedirs(OUTPUT_PATH, exist_ok=True)

def extract_aest_from_filename(filename):
    """Extracts AEST datetime from filename."""
    match = re.search(r"(\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2})", filename)  
    if match:
        aest_str = match.group(1)
        return datetime.strptime(aest_str, "%Y-%m-%d %H-%M-%S")  # Convert to datetime
    return None

# Extract AEST time
aest_start_time = extract_aest_from_filename(base_name)

def convert_aest_to_utc(aest_time):
    """Converts AEST datetime to UTC."""
    aest = pytz.timezone("Australia/Sydney")  # Handles daylight saving
    utc = pytz.utc
    return aest.localize(aest_time).astimezone(utc)

# Convert AEST → UTC
utc_start_time = convert_aest_to_utc(aest_start_time)

def utc_to_decimal(utc_time):
    """Converts UTC datetime to decimal format (seconds of the day)."""
    midnight = utc_time.replace(hour=0, minute=0, second=0, microsecond=0)
    seconds_since_midnight = (utc_time - midnight).total_seconds()
    return round(seconds_since_midnight, 1)  # Keep one decimal place

# Convert UTC → Decimal seconds
utc_decimal_start = utc_to_decimal(utc_start_time)

# Function to load the homography matrix from the JSON file
def load_homography_matrix():
    """
    Interactively select and load the homography matrix from a JSON file.
    """
    print("Select the homography matrix JSON file.")
    root = tk.Tk()
    root.withdraw()  # Hide the main Tkinter window
    json_file = filedialog.askopenfilename(
        title="Select Homography Matrix JSON File",
        filetypes=[("JSON Files", "*.json"), ("All Files", "*.*")]
    )
    if not json_file:
        print("No file selected. Exiting.")
        exit()
    with open(json_file, 'r') as f:
        data = json.load(f)
    print(f"Loaded homography matrix from {json_file}")
    return np.array(data['homography_matrix'], dtype=np.float32)

# Load the homography matrix from the JSON file
homography_matrix = load_homography_matrix()

# Function to map pixel points to real-world coordinates using the homography matrix
def pixel_to_real_world(pixel_point, homography_matrix):
    """
    Maps a pixel point to real-world coordinates using the homography matrix.
    """
    pixel_point_homogeneous = np.array([[pixel_point[0], pixel_point[1], 1]], dtype=np.float32).T
    real_world_point = np.dot(homography_matrix, pixel_point_homogeneous)
    real_world_x = real_world_point[0] / real_world_point[2]
    real_world_y = real_world_point[1] / real_world_point[2]
    return real_world_x[0], real_world_y[0]  # Extract scalar values

# Load calibration data
calibration_data = np.load(CALIBRATION_DATA_PATH)
camera_matrix = calibration_data['camera_matrix']
dist_coeffs = calibration_data['dist_coeffs']

# Initialize wheel position
wheel_position_selected = False
WHEEL_POSITION_X = None
WHEEL_POSITION_Y = None

def select_wheel_position(event, x, y, flags, param):
    global WHEEL_POSITION_X, WHEEL_POSITION_Y, wheel_position_selected
    if event == cv2.EVENT_LBUTTONDOWN:
        WHEEL_POSITION_X, WHEEL_POSITION_Y = x, y
        wheel_position_selected = True
        print(f"Wheel position selected at: ({WHEEL_POSITION_X}, {WHEEL_POSITION_Y})")

def calculate_angle(line):
    """Calculate the angle of the line in degrees."""
    x1, y1, x2, y2 = line
    return np.degrees(np.arctan2(y2 - y1, x2 - x1))

def is_lane_line(line, slope_range=(0.05, 0.3)):
    """Filter lines based on the slope range to isolate lane lines."""
    x1, y1, x2, y2 = line
    if x2 == x1:  # avoid division by zero for vertical lines
        return False
    slope = abs((y2 - y1) / (x2 - x1))
    return slope_range[0] <= slope <= slope_range[1]

def detect_lane_lines(frame):
    """Detect white horizontal lane lines in a frame."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower_white = np.array([0, 0, 200]) 
    upper_white = np.array([180, 50, 255])
    mask_white = cv2.inRange(hsv, lower_white, upper_white)
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 9))
    mask_white = cv2.morphologyEx(mask_white, cv2.MORPH_CLOSE, kernel)
    mask_white = cv2.morphologyEx(mask_white, cv2.MORPH_OPEN, kernel)
    
    # Apply Gaussian blur before edge detection
    edges = cv2.GaussianBlur(mask_white, (9, 9), 0)
    edges = cv2.Canny(edges, 50, 150)

    # Detect lines using Hough Transform with adjusted parameters
    lines = cv2.HoughLinesP(edges, 
                            rho=1, 
                            theta=np.pi / 360,  
                            threshold=80,       
                            minLineLength=100,  
                            maxLineGap=50)     
    
    filtered_lines = []
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            if is_lane_line((x1, y1, x2, y2)):  # Filter based on slope range
                filtered_lines.append((x1, y1, x2, y2))
    
    return filtered_lines

def crop_quarter(frame):
    # """Crop the top-right quarter of the frame."""
    # height, width = frame.shape[:2]
    # return frame[:height // 2, width // 2:]  # Crop to top-right quarter

    """Crop the bottom-left quarter of the frame."""
    height, width = frame.shape[:2]
    return frame[height // 2:, :width // 2]  # Crop to bottom-left quarter

# Function to map a pixel point to real-world coordinates
def pixel_to_real_world(pixel_point, homography_matrix):
    """
    Maps a pixel point to real-world coordinates using the homography matrix.
    """
    # Convert the pixel point to homogeneous coordinates
    pixel_point_homogeneous = np.array([[pixel_point[0], pixel_point[1], 1]], dtype=np.float32).T

    # Apply the homography transformation
    real_world_point = np.dot(homography_matrix, pixel_point_homogeneous)

    # Normalize the coordinates
    real_world_x = real_world_point[0] / real_world_point[2]
    real_world_y = real_world_point[1] / real_world_point[2]

    return real_world_x[0], real_world_y[0]  # Extract scalar values

# Function to calculate the Euclidean distance between two points
def calculate_distance(point1, point2):
    """
    Calculate the Euclidean distance between two 2D points.
    """
    x1, y1 = point1
    x2, y2 = point2
    distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    return distance

def process_frame(frame):
    """Process a cropped frame, detect lane lines, and measure distance from the wheel point with sub-pixel accuracy."""
    # Step 1: Crop the frame first
    cropped_frame = crop_quarter(frame)

    # Step 2: Apply undistortion only to the cropped frame
    undistorted_cropped_frame = cv2.undistort(cropped_frame, camera_matrix, dist_coeffs)

    # Define the reference point (wheel position in the cropped frame)
    reference_x = WHEEL_POSITION_X
    reference_y = WHEEL_POSITION_Y

    filtered_lines = detect_lane_lines(undistorted_cropped_frame)
    frame_with_lines = undistorted_cropped_frame.copy()

    # Draw the detected horizontal lane lines
    for line in filtered_lines:
        x1, y1, x2, y2 = line
        cv2.line(frame_with_lines, (x1, y1), (x2, y2), (0, 255, 0), 2)

    # Draw the reference vertical line from the wheel position upwards
    cv2.line(frame_with_lines, (reference_x, reference_y), (reference_x, 0), (255, 0, 0), 1)

    # Initialize the closest intersection point
    closest_distance_px = None
    closest_intersection_y = None

    # Calculate precise intersections with each horizontal line
    for x1, y1, x2, y2 in filtered_lines:
        if min(x1, x2) <= reference_x <= max(x1, x2):  # Check if line crosses vertical at reference_x
            # Calculate precise intersection with sub-pixel accuracy
            y_intersect = y1 + (reference_x - x1) * (y2 - y1) / (x2 - x1)
            if y_intersect < reference_y:
                distance_px = reference_y - y_intersect  # Vertical distance in pixels
                if closest_distance_px is None or distance_px < closest_distance_px:
                    closest_distance_px = distance_px
                    closest_intersection_y = y_intersect

    # Convert closest distance to centimeters
    vertical_distance_cm = None
    if closest_distance_px is not None:
        # vertical_distance_cm = closest_distance_px * PIXEL_TO_CM
        # Create the pixel points of the vertical line (center bottom point and )
        ver_x1 = WHEEL_POSITION_X
        ver_y1 = WHEEL_POSITION_Y
        ver_x2 = WHEEL_POSITION_X
        ver_y2 = int(closest_intersection_y)
        image_points = [(ver_x1, ver_y1), (ver_x2, ver_y2)]
        
        # Variable to store real-world points
        real_world_points = []

        # Calculate real-world coordinates for each point and save them
        for point in image_points:
            real_world_x, real_world_y = pixel_to_real_world(point, homography_matrix)
            real_world_points.append((real_world_x, real_world_y))

        # Calculate the distance between the two points
        vertical_distance_cm = calculate_distance(real_world_points[0], real_world_points[1])
        print(vertical_distance_cm)
        # Draw the precise measurement line in red
        cv2.line(frame_with_lines, (reference_x, reference_y), (reference_x, int(closest_intersection_y)), (0, 0, 255), 2)

    return frame_with_lines, vertical_distance_cm

video_capture = cv2.VideoCapture(video_input_path)

if not video_capture.isOpened():
    print("Error: Video file could not be opened.")
    exit()

# Display the first frame for selecting the wheel position
ret, frame = video_capture.read()
if ret:
    cropped_frame = crop_quarter(frame)
    cv2.imshow("Select Wheel Position", cropped_frame)
    cv2.setMouseCallback("Select Wheel Position", select_wheel_position)
    while not wheel_position_selected:
        cv2.waitKey(1)  # Wait until the user clicks on the wheel position
    cv2.destroyWindow("Select Wheel Position")
else:
    print("Error: Could not read the first frame for wheel selection.")
    video_capture.release()
    exit()

fps = video_capture.get(cv2.CAP_PROP_FPS)
frame_width = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH) // 2)
frame_height = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT) // 2)

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
video_writer = cv2.VideoWriter(video_output_path, fourcc, fps, (frame_width, frame_height))

with open(csv_output_path, 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['frame', 'seconds', 'cm_from_lane_line', 'UTC_time'])

    frame_number = 0
    while True:  # Process all frames until the end of the video
        ret, frame = video_capture.read()
        if not ret:
            break  # Stop when no more frames are available

        timestamp = video_capture.get(cv2.CAP_PROP_POS_MSEC) / 1000  # Timestamp in seconds

         # Convert to UTC decimal format
        utc_decimal_time = round(utc_decimal_start + timestamp, 1)

        frame_with_lines, vertical_distance_cm = process_frame(frame)

        # Write data to CSV
        if vertical_distance_cm is not None:
            csv_writer.writerow([frame_number, timestamp, vertical_distance_cm, utc_decimal_time])
        else:
            csv_writer.writerow([frame_number, timestamp, 'NaN', utc_decimal_time])

        # Write processed frame to output video
        video_writer.write(frame_with_lines)
        frame_number += 1

    video_capture.release()
    video_writer.release()
    cv2.destroyAllWindows()