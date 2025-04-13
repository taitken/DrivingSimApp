import json
import os
import cv2
import numpy as np
from services.utility_service import UtilityService
from models.xy import XY

# This script is for 
# 1) calculating homography calibration matrix and 
# 2) validating if a length (from any randomlt selected two points) aligh with its physical length in the real world.
# Input: A chessboard video recorded for homography calibration purpose (saved in folder "video")
# Output: Homography matrix (saved in folder "output") and real_world_points.npy
# Note: A 2 × 10 chessboard grid, where each grid cell measured 35 cm × 20 cm

class CalibrationService:

    def perform_homography_mtx_calculation(self, _calibration_points: list[XY], _real_world_points: list[XY], video_file_name: str):
        """
        Creates a homography matrix, and maps two given test points
        """
        calibration_points = UtilityService.convert_xy_dict_to_tuple_list(_calibration_points)
        real_world_points = UtilityService.convert_xy_dict_to_tuple_list(_real_world_points)
        # Call the function to input points, Compute the homography matrix, Save the homography matrix to a JSON file
        H, _ = cv2.findHomography(np.array(calibration_points, dtype=np.float32), np.array(real_world_points, dtype=np.float32))
        file_name = os.path.join(UtilityService.HOMOGRAPHY_OUTPUT_FOLDER, f'{os.path.splitext(video_file_name)[0]}_homography_matrix.json')
        self.__save_homography_matrix(file_name, H.tolist())

        return f"File saved: {file_name}"
    
    def check_distance_between_two_real_world_points(self, homography_matrix_file: str, _real_world_points: list[XY]):
        real_world_points = UtilityService.convert_xy_to_tuple_list(_real_world_points)
        homography_matrix = UtilityService.load_homography_matrix(homography_matrix_file)

        # Calculate real-world coordinates for each point and save them
        test_real_world_points = []
        for tPoint in real_world_points:
            real_world_x, real_world_y = UtilityService.pixel_to_real_world(tPoint, homography_matrix)
            test_real_world_points.append((real_world_x, real_world_y))

        # Calculate the distance between the two points
        distance = UtilityService.calculate_distance(test_real_world_points[0], test_real_world_points[1])
        print(f"Distance between the two points: {distance:.2f} cm")
        return f"{distance:.2f}"
        

    @staticmethod
    def __save_homography_matrix(homography_file: str, H_list) -> list[XY]:
        # Write to JSON file
        with open(homography_file, 'w') as f:
            json.dump({"homography_matrix": H_list}, f)
    

