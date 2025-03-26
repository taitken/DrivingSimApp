from flask import Flask
from endpoints import endpoint_blueprint

app: Flask = Flask(__name__)

app.register_blueprint(endpoint_blueprint)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)