from flask import Blueprint, Flask
import cv2
import dotenv
import numpy as np
import os
import tkinter as tk
from tkinter import filedialog
from datetime import datetime, timedelta

endpoint_blueprint = Blueprint('endpoint_blueprint', __name__)

@endpoint_blueprint.route('/', methods=['GET'])
def Hello():
    return "Hello my name is Tilla"

@endpoint_blueprint.route('/vidya', methods=['GET'])
def VidyaPost():
    def select_video_file():
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        file_path = filedialog.askopenfilename(title="Select a Video File", filetypes=[("All Files", "*.*")])
        return file_path
    video_path = select_video_file()

    WORKING_DIR = os.path.dirname(os.path.dirname(os.getcwd()))
    CALIBRATION_DATA_PATH = WORKING_DIR + 'silly' + os.getenv('CALIBRATION_DATA_PATH')
    REAL_WORLD_POINTS_PATH = WORKING_DIR + os.getenv('REAL_WORLD_POINTS_PATH')
    OUTPUT_PATH = WORKING_DIR + os.getenv('OUTPUT_PATH')

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

    return "Hello my name is Tilla"