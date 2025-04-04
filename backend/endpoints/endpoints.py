from flask import Blueprint, Flask
from services.calibration_service import CalibrationService
from flask import request

endpoint_blueprint = Blueprint('endpoint_blueprint', __name__)

@endpoint_blueprint.route('/', methods=['GET'])
def Hello():
    return "Hello my name is Tilla"

@endpoint_blueprint.route('/vidya', methods=['POST'])
def VidyaPost():
    # Handle request objects
    request_data = request.get_json()
    calibration_points = request_data['calibrationPoints']
    real_world_points = request_data['realWorldPoints']
    test_points = request_data['testPoints']
    video_file_name = request_data['videoFileName']

    calibration_service = CalibrationService()
    return calibration_service.perform_homography_mtx_calculation(calibration_points, real_world_points, test_points, video_file_name)