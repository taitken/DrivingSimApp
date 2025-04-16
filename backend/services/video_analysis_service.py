import csv
import cv2
import numpy as np
from services.utility_service import UtilityService
from models.xy import XY

class VideoAnalysisService:
    CSV_OUTPUT_PATH = UtilityService.OUTPUT_FOLDER + '\\test_output.csv'
    CALIBRATION_FILE_PATH = UtilityService.RESOURCE_PATH + '\\calibration_data.npz'
    homography_matrix = None
    camera_matrix = None
    dist_coeffs = None

    def analyse_video(self, homography_matrix_file: str, video_file: str, crop_top_left: XY, crop_bottom_right: XY, wheel_position: XY):
        """
        Creates a homography matrix, and maps two given test points
        """
        aest_start_time = UtilityService.extract_aest_from_filename(video_file)
        utc_start_time = UtilityService.convert_aest_to_utc(aest_start_time)
        utc_decimal_start = UtilityService.utc_to_decimal(utc_start_time)

        # Load the homography matrix from the JSON file
        self.homography_matrix = UtilityService.load_homography_matrix(homography_matrix_file)
        
        # Load calibration data
        calibration_data = np.load(self.CALIBRATION_FILE_PATH)
        self.camera_matrix = calibration_data['camera_matrix']
        self.dist_coeffs = calibration_data['dist_coeffs']
        video_capture = cv2.VideoCapture(UtilityService.TMP_VIDEO_FOLDER + "/" + video_file)

        if not video_capture.isOpened():
            print("Error: Video file could not be opened.")
            exit()

        # Display the first frame for selecting the wheel position
        ret, frame = video_capture.read()

        fps = video_capture.get(cv2.CAP_PROP_FPS)
        frame_width = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH) // 2)
        frame_height = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT) // 2)

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video_writer = cv2.VideoWriter(UtilityService.RESOURCE_PATH, fourcc, fps, (frame_width, frame_height))

        with open(self.CSV_OUTPUT_PATH, 'w', newline='') as csv_file:
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

                frame_with_lines, vertical_distance_cm = self.__process_frame(frame, crop_top_left, crop_bottom_right, wheel_position)

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

        return "Completed" 


    def __process_frame(self, frame, crop_top_left: XY, crop_bottom_right: XY, wheel_position: XY):
        """Process a cropped frame, detect lane lines, and measure distance from the wheel point with sub-pixel accuracy."""
        # Step 1: Crop the frame first
        cropped_frame = self.__crop_quarter(frame, crop_top_left, crop_bottom_right)

        # Step 2: Apply undistortion only to the cropped frame
        undistorted_cropped_frame = cv2.undistort(cropped_frame, self.camera_matrix, self.dist_coeffs)

        # Define the reference point (wheel position in the cropped frame)
        reference_x = wheel_position.x
        reference_y = wheel_position.y

        filtered_lines = self.__detect_lane_lines(undistorted_cropped_frame)
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
            ver_x1 = wheel_position.y
            ver_y1 = wheel_position.x
            ver_x2 = wheel_position.x
            ver_y2 = int(closest_intersection_y)
            image_points = [(ver_x1, ver_y1), (ver_x2, ver_y2)]
            
            # Variable to store real-world points
            real_world_points = []

            # Calculate real-world coordinates for each point and save them
            for point in image_points:
                real_world_x, real_world_y = UtilityService.pixel_to_real_world(point, self.homography_matrix)
                real_world_points.append((real_world_x, real_world_y))

            # Calculate the distance between the two points
            vertical_distance_cm = UtilityService.calculate_distance(real_world_points[0], real_world_points[1])
            print(vertical_distance_cm)
            # Draw the precise measurement line in red
            cv2.line(frame_with_lines, (reference_x, reference_y), (reference_x, int(closest_intersection_y)), (0, 0, 255), 2)

        return frame_with_lines, vertical_distance_cm

    def __detect_lane_lines(self, frame):
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
                if self.__is_lane_line((x1, y1, x2, y2)):  # Filter based on slope range
                    filtered_lines.append((x1, y1, x2, y2))
        
        return filtered_lines

    @staticmethod
    def __is_lane_line(line, slope_range=(0.05, 0.3)):
        """Filter lines based on the slope range to isolate lane lines."""
        x1, y1, x2, y2 = line
        if x2 == x1:  # avoid division by zero for vertical lines
            return False
        slope = abs((y2 - y1) / (x2 - x1))
        return slope_range[0] <= slope <= slope_range[1]

    @staticmethod
    def __crop_quarter(frame, top_left: XY, bottom_right: XY):
        """Crop the top-right quarter of the frame."""
        return frame[top_left.x : bottom_right.x, top_left.y : bottom_right.y]



