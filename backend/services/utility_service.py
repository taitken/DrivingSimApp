from datetime import datetime
import json
import os
import re
from tkinter import filedialog 
import tkinter
import numpy as np
import pytz
from models.xy import XY

class UtilityService:
    RESOURCE_PATH = os.getcwd() + '\\resources'
    HOMOGRAPHY_OUTPUT_FOLDER = RESOURCE_PATH + '\\homography_matrices'
    TMP_VIDEO_FOLDER = RESOURCE_PATH + '\\tmp'
    OUTPUT_FOLDER = RESOURCE_PATH + '\\output'
    
    @staticmethod
    def extract_aest_from_filename(filename):
        """Extracts AEST datetime from filename."""
        match = re.search(r"(\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2})", filename)  
        if match:
            aest_str = match.group(1)
            return datetime.strptime(aest_str, "%Y-%m-%d %H-%M-%S")  # Convert to datetime
        return None

    @staticmethod
    def convert_aest_to_utc(aest_time):
        """Converts AEST datetime to UTC."""
        aest = pytz.timezone("Australia/Sydney")  # Handles daylight saving
        utc = pytz.utc
        return aest.localize(aest_time).astimezone(utc)

    @staticmethod
    def utc_to_decimal(utc_time):
        """Converts UTC datetime to decimal format (seconds of the day)."""
        midnight = utc_time.replace(hour=0, minute=0, second=0, microsecond=0)
        seconds_since_midnight = (utc_time - midnight).total_seconds()
        return round(seconds_since_midnight, 1)  # Keep one decimal place

    # Function to map a pixel point to real-world coordinates
    @staticmethod
    def pixel_to_real_world(pixel_point: tuple[int, int], homography_matrix):
        """
        Maps a pixel point to real-world coordinates using the homography matrix.
        """
        # Convert the pixel point to homogeneous coordinates, and Apply the homography transformation
        pixel_point_homogeneous = np.array([[pixel_point[0], pixel_point[1], 1]], dtype=np.float32).T
        real_world_point = np.dot(homography_matrix, pixel_point_homogeneous)

        # Normalize the coordinates
        real_world_x = real_world_point[0] / real_world_point[2]
        real_world_y = real_world_point[1] / real_world_point[2]

        return real_world_x[0], real_world_y[0]  # Extract scalar values

    @staticmethod
    def calculate_angle(line):
        """Calculate the angle of the line in degrees."""
        x1, y1, x2, y2 = line
        return np.degrees(np.arctan2(y2 - y1, x2 - x1))

    # Function to calculate the Euclidean distance between two points
    @staticmethod
    def calculate_distance(point1, point2):
        """
        Calculate the Euclidean distance between two 2D points.
        """
        x1, y1 = point1
        x2, y2 = point2
        distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        return distance
    
    @staticmethod
    def convert_xy_dict_to_tuple_list(xy_list: list[XY]):
        tuple_list = []
        for xy in xy_list:
            tuple_list.append((xy['x'], xy['y']))
        return tuple_list
    
    @staticmethod
    def convert_xy_to_tuple_list(xy_list: list[XY]):
        tuple_list = []
        for xy in xy_list:
            tuple_list.append((xy.x, xy.y))
        return tuple_list
    
    
    # Function to load the homography matrix from the JSON file
    @staticmethod
    def load_homography_matrix(file_path: str):
        """
        Retrieves the selected homography matrix file
        """
        with open(UtilityService.HOMOGRAPHY_OUTPUT_FOLDER + "\\" + file_path, 'r') as f:
            data = json.load(f)
        return np.array(data['homography_matrix'], dtype=np.float32)
    
    # Load video
    def select_video_file():
        root = tkinter.Tk()
        root.withdraw()  # Hide the main window
        file_path = filedialog.askopenfilename(title="Select a Video File", filetypes=[("All Files", "*.*")])
        return file_path


