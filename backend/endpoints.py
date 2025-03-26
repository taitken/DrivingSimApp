from flask import Blueprint, Flask

endpoint_blueprint = Blueprint('endpoint_blueprint', __name__)

@endpoint_blueprint.route('/test', methods=['GET'])
def Hello(self):
    print("Hello my name is Tilla")

