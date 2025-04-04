# Define constants
import json
import os
import cv2
import numpy as np
from models.xy import XY


class CalibrationService:
    OUTPUT_PATH = os.getcwd() + '\\backend\\resources'

    def perform_homography_mtx_calculation(self, _calibration_points: list[XY], _real_world_points: list[XY], _test_points: list[XY], video_file_name: str):
        """
        Creates a homography matrix, and maps two given test points
        """
        calibration_points = self.__convert_xy_to_tuple_list(_calibration_points)
        real_world_points = self.__convert_xy_to_tuple_list(_real_world_points)
        test_points = self.__convert_xy_to_tuple_list(_test_points)
        # Call the function to input points, Compute the homography matrix, Save the homography matrix to a JSON file
        H, _ = cv2.findHomography(np.array(calibration_points, dtype=np.float32), np.array(real_world_points, dtype=np.float32))
        self.__save_homography_matrix(os.path.join(self.OUTPUT_PATH, f'{os.path.splitext(video_file_name)[0]}_homography_matrix.json'), H.tolist())

        # Calculate real-world coordinates for each point and save them
        test_real_world_points = []
        for tPoint in test_points:
            real_world_x, real_world_y = self.__pixel_to_real_world(tPoint, H)
            test_real_world_points.append((real_world_x, real_world_y))
        print("Real-world points:", test_real_world_points)

        # Calculate the distance between the two points
        distance = self.__calculate_distance(test_real_world_points[0], test_real_world_points[1])
        print(f"Distance between the two points: {distance:.2f} cm")

        return f"{distance:.2f}"

    @staticmethod
    def __save_homography_matrix(homography_file: str, H_list) -> list[XY]:
        # Write to JSON file
        with open(homography_file, 'w') as f:
            json.dump({"homography_matrix": H_list}, f)

    # Function to map a pixel point to real-world coordinates
    @staticmethod
    def __pixel_to_real_world(pixel_point: XY, homography_matrix):
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
    
    # Function to calculate the Euclidean distance between two points
    @staticmethod
    def __calculate_distance(point1, point2):
        """
        Calculate the Euclidean distance between two 2D points.
        """
        x1, y1 = point1
        x2, y2 = point2
        distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        return distance
    
    @staticmethod
    def __convert_xy_to_tuple_list(xy_list: list[XY]):
        tuple_list = []
        for xy in xy_list:
            tuple_list.append((xy['x'], xy['y']))
        return tuple_list
