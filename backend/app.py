import dotenv
from flask import Flask
from flask_cors import CORS
from endpoints.endpoints import endpoint_blueprint

dotenv.load_dotenv()
app: Flask = Flask(__name__)
CORS(app)

app.register_blueprint(endpoint_blueprint, url_prefix='/backend')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)

for rule in app.url_map.iter_rules():
    print(rule)