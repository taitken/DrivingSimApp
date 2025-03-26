import cv2
import dotenv
import numpy as np
import os
import json  
import tkinter as tk
from tkinter import filedialog

# This script is for 
# 1) calculating homography calibration matrix and 
# 2) validating if a length (from any randomlt selected two points) aligh with its physical length in the real world.
# Input: A chessboard video recorded for homography calibration purpose (saved in folder "video")
# Output: Homography matrix (saved in folder "output") and real_world_points.npy
# Note: A 2 × 10 chessboard grid, where each grid cell measured 35 cm × 20 cm

# Define constants
dotenv.load_dotenv()
CALIBRATION_DATA_PATH = os.getcwd() + os.getenv('CALIBRATION_DATA_PATH')
REAL_WORLD_POINTS_PATH = os.getcwd() + os.getenv('REAL_WORLD_POINTS_PATH')
OUTPUT_PATH = os.getcwd() + os.getenv('OUTPUT_PATH')

# Load calibration data
calibration_data = np.load(CALIBRATION_DATA_PATH) # this calibration is for correcting wide angle
camera_matrix = calibration_data['camera_matrix']
dist_coeffs = calibration_data['dist_coeffs']

##################################################################
# Step 1: capture the four pixel corner points in a square in a picture from a video
##################################################################

# Initialize a list to store points
points = []

# Define the mouse callback function
def click_event(event, x, y, flags, param):
    """
    Callback function to capture mouse click points.
    """
    if event == cv2.EVENT_LBUTTONDOWN:  # Left mouse button click
        points.append((x, y))           # Add the point to the list
        print(f"Point captured: ({x}, {y})")
        cv2.circle(undistorted_cropped_frame, (x, y), 5, (0, 0, 255), -1)  # Draw a red circle at the clicked point
        cv2.imshow('Cropped Frame', undistorted_cropped_frame)

        # Stop after capturing 4 points
        if len(points) == 4:
            cv2.destroyAllWindows()

# Load the video
# Load the Homography Calibration Video
def select_video_file():
    root = tk.Tk()
    root.withdraw()  # Hide the main window
    file_path = filedialog.askopenfilename(title="Select a Video File", filetypes=[("All Files", "*.*")])
    return file_path

video_path = select_video_file()
cap = cv2.VideoCapture(video_path)

# Check if the video opened successfully
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

# Read the first frame
ret, frame = cap.read()
cap.release()  # Release the video since we're only using the first frame

if not ret:
    print("Error: Could not read the first frame.")
    exit()

# Define cropping dimensions (adjust as needed for your specific video)
# Example: Crop left-bottom quarter of the frame
height, width, _ = frame.shape
cropped_frame = frame[height // 2 :, :width // 2]  # Crop bottom-left corner
undistorted_cropped_frame = cv2.undistort(cropped_frame, camera_matrix, dist_coeffs)

# Display the cropped frame and set up the mouse callback
cv2.imshow('Cropped Frame', undistorted_cropped_frame)
cv2.setMouseCallback('Cropped Frame', click_event)

print("Click on 4 corner points of the square in the video. Press ESC to exit if needed.")

# Wait for user to click 4 points
cv2.waitKey(0)

# After capturing 4 points, print them
if len(points) == 4:
    print("Captured points:", points)
else:
    print("Less than 4 points were captured.")

cv2.destroyAllWindows()

##################################################################
# Step 2: Compute the Homography Matrix
##################################################################
# Image points (pixel coordinates of markers)
image_points = np.array(points, dtype=np.float32)

# Real-world points (corresponding real-world coordinates in centimeters)
# real_world_points = np.array([
#     [0, 0],
#     [100, 0],
#     [100, 200],
#     [0, 200]
# ], dtype=np.float32)

def input_real_world_points(file_name=REAL_WORLD_POINTS_PATH):
    """
    Interactively prompts the user to input real-world coordinates and automatically saves them.
    """
    print("\nEnter the real-world coordinates (in centimeters) for the 4 points, ensuring the sequence matches the order in which you clicked the points in the previous video.")
    real_world_points = []
    
    for i in range(4):  # Assuming 4 points are needed
        print(f"Point {i + 1}:")
        x = float(input("  Enter x-coordinate: "))
        y = float(input("  Enter y-coordinate: "))
        real_world_points.append([x, y])
    
    real_world_points = np.array(real_world_points, dtype=np.float32)
    print("\nReal-world points:")
    print(real_world_points)
    
    # Save the points automatically to the specified file
    np.save(file_name, real_world_points)
    print(f"\nReal-world points automatically saved to '{file_name}'.")
    
    return real_world_points

def get_real_world_points(file_name=REAL_WORLD_POINTS_PATH):
    """
    Checks if real-world points have been entered previously. If yes, loads them.
    Otherwise, prompts the user to enter the points manually and saves them.
    """
    if os.path.exists(file_name):
        use_previous = input(f"Real-world points file '{file_name}' found. Do you want to use the previously saved points? (yes/no): ").strip().lower()
        if use_previous == "yes":
            # Load the points from the file
            real_world_points = np.load(file_name)
            print("\nUsing previously saved real-world points:")
            print(real_world_points)
            return real_world_points
    # If no file exists or user chooses not to use the previous points
    return input_real_world_points(file_name)

# Call the function to input points
real_world_points = get_real_world_points()

# Compute the homography matrix
H, _ = cv2.findHomography(image_points, real_world_points)

# Save the homography matrix to a JSON file
base_name = os.path.splitext(os.path.basename(video_path))[0]  
homography_file = os.path.join(OUTPUT_PATH, f'{base_name}_homography_matrix.json')

# Convert the matrix to a Python list for JSON serialization
H_list = H.tolist()

# Write to JSON file
with open(homography_file, 'w') as f:
    json.dump({"homography_matrix": H_list}, f)

print(f"Homography matrix saved to {homography_file}")

########################################################################################################
# Step 3: Randomly select two pixel points in the image with a known physical distance in the real world
########################################################################################################
# Initialize a list to store points
points = []

# Define the mouse callback function
def click_event(event, x, y, flags, param):
    """
    Callback function to capture mouse click points.
    """
    if event == cv2.EVENT_LBUTTONDOWN:  # Left mouse button click
        points.append((x, y))           # Add the point to the list
        print(f"Point captured: ({x}, {y})")
        cv2.circle(undistorted_cropped_frame, (x, y), 5, (0, 0, 255), -1)  # Draw a red circle at the clicked point
        cv2.imshow('Cropped Frame', undistorted_cropped_frame)

        # Stop after capturing 2 points
        if len(points) == 2:
            cv2.destroyAllWindows()

# Load the video
video_path = select_video_file() 
cap = cv2.VideoCapture(video_path)

# Check if the video opened successfully
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

# Read the first frame
ret, frame = cap.read()
cap.release()  # Release the video since we're only using the first frame

if not ret:
    print("Error: Could not read the first frame.")
    exit()

# Define cropping dimensions (adjust as needed for your specific video)
# Example: Crop left-bottom quarter of the frame
height, width, _ = frame.shape
cropped_frame = frame[height // 2 :, :width // 2]  # Crop bottom-left corner
undistorted_cropped_frame = cv2.undistort(cropped_frame, camera_matrix, dist_coeffs)

# Display the cropped frame and set up the mouse callback
cv2.imshow('Cropped Frame', undistorted_cropped_frame)
cv2.setMouseCallback('Cropped Frame', click_event)

print("Click on 2 random points in the video, ensuring that you know the distance between them. Press ESC to exit if needed.")

# Wait for user to click 2 points
cv2.waitKey(0)

# After capturing 2 points, print them
if len(points) == 2:
    print("Captured points:", points)
else:
    print("Less than 2 points were captured.")

cv2.destroyAllWindows()

########################################################################################################
# Step 4: Apply the Homography to Map Points
########################################################################################################
# Example points in the image (pixel coordinates)
points = points  # Replace these with your captured pixel points

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

# Variable to store real-world points
real_world_points = []

# Calculate real-world coordinates for each point and save them
for point in points:
    real_world_x, real_world_y = pixel_to_real_world(point, H)
    real_world_points.append((real_world_x, real_world_y))

# Print and save the real-world points
print("Real-world points:", real_world_points)

########################################################################################################
# Step 4: Calculate the real-world distance between the selected two points in the image
########################################################################################################

# Function to calculate the Euclidean distance between two points
def calculate_distance(point1, point2):
    """
    Calculate the Euclidean distance between two 2D points.
    """
    x1, y1 = point1
    x2, y2 = point2
    distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    return distance

# Calculate the distance between the two points
distance = calculate_distance(real_world_points[0], real_world_points[1])

# Print the distance
print(f"Distance between the two points: {distance:.2f} cm")