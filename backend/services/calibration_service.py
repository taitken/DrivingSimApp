# Define constants
import os
import dotenv
import numpy as np

class CalibrationService:
    dotenv.load_dotenv()
    CALIBRATION_DATA_PATH = os.getcwd() + os.getenv('CALIBRATION_DATA_PATH')
    REAL_WORLD_POINTS_PATH = os.getcwd() + os.getenv('REAL_WORLD_POINTS_PATH')
    OUTPUT_PATH = os.getcwd() + os.getenv('OUTPUT_PATH')

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
        return CalibrationService.input_real_world_points(file_name)
    
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