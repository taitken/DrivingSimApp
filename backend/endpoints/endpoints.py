from typing import List
from flask import Blueprint, Flask
from models.xy import XY
from services.video_analysis_service import VideoAnalysisService
from services.calibration_service import CalibrationService
from flask import request

endpoint_blueprint = Blueprint('endpoint_blueprint', __name__)

@endpoint_blueprint.route('/', methods=['GET'])
def Hello():
    return "Hello my name is Tilla"

@endpoint_blueprint.route('/calibrate', methods=['POST'])
def calibrate():
    # Handle request objects
    request_data = request.get_json()
    calibration_points: List[XY] = request_data['calibrationPoints']
    real_world_points: List[XY] = request_data['realWorldPoints']
    video_file_name: str = request_data['videoFileName']

    calibration_service = CalibrationService()
    return calibration_service.perform_homography_mtx_calculation(calibration_points, real_world_points, video_file_name)

@endpoint_blueprint.route('/calc-distance', methods=['GET'])
def calc_distance():
    # Handle request objects
    firstX: int = request.args.get('firstX')
    firstY: int = request.args.get('firstY')
    secondX: int = request.args.get('secondX')
    secondY: int = request.args.get('secondY')
    homography_matrix_file: str = request.args.get('homographyMatrixFile')
    real_world_poitns = []
    real_world_poitns.append(XY(firstX, firstY))
    real_world_poitns.append(XY(secondX, secondY))
 
    calibration_service = CalibrationService()
    return calibration_service.check_distance_between_two_real_world_points(homography_matrix_file, real_world_poitns)

@endpoint_blueprint.route('/process-video', methods=['POST'])
def process_video():
    # Handle request objects
    request_data = request.get_json()
    video_file: str = request_data['videoFile']
    homography_matrix_file: str = request_data['homographyMatrixFile']
    crop_top_left: XY = XY.from_dict(request_data['cropTopLeft'])
    crop_bottom_right: XY = XY.from_dict(request_data['cropBottomRight'])
    wheel_position: XY = XY.from_dict(request_data['wheelPosition'])

    video_analysis_service = VideoAnalysisService()
    return video_analysis_service.analyse_video(video_file, homography_matrix_file, 'CANTRACK_01_006_V1_D1_2025-03-04 10-51-08', crop_top_left, crop_bottom_right, wheel_position)
