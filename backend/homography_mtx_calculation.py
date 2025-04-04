import cv2
import dotenv
import numpy as np
import os
import json  
import tkinter as tk
from tkinter import filedialog
from backend.services.calibration_service import CalibrationService

# This script is for 
# 1) calculating homography calibration matrix and 
# 2) validating if a length (from any randomlt selected two points) aligh with its physical length in the real world.
# Input: A chessboard video recorded for homography calibration purpose (saved in folder "video")
# Output: Homography matrix (saved in folder "output") and real_world_points.npy
# Note: A 2 × 10 chessboard grid, where each grid cell measured 35 cm × 20 cm


# Load calibration data
calibration_service = CalibrationService()
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
real_world_points = np.array([
    [0, 0],
    [100, 0],
    [100, 200],
    [0, 200]
], dtype=np.float32)

# Call the function to input points, Compute the homography matrix, Save the homography matrix to a JSON file
H, _ = cv2.findHomography(image_points, real_world_points)
H_list = H.tolist()
base_name = os.path.splitext(os.path.basename(video_path))[0]  
homography_file = os.path.join(OUTPUT_PATH, f'{base_name}_homography_matrix.json')

# Write to JSON file
with open(homography_file, 'w') as f:
    json.dump({"homography_matrix": H_list}, f)

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

# Variable to store real-world points
real_world_points = []

# Calculate real-world coordinates for each point and save them
for point in points:
    real_world_x, real_world_y = calibration_service.pixel_to_real_world(point, H)
    real_world_points.append((real_world_x, real_world_y))

# Print and save the real-world points
print("Real-world points:", real_world_points)

########################################################################################################
# Step 4: Calculate the real-world distance between the selected two points in the image
########################################################################################################

# Calculate the distance between the two points
distance = calibration_service.calculate_distance(real_world_points[0], real_world_points[1])

# Print the distance
print(f"Distance between the two points: {distance:.2f} cm")