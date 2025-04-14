import axios, { AxiosHeaders, AxiosResponse, ResponseType } from "axios";
import { XY } from "../models/xy.model";

export class BackendService {
  BASE_URL: string = 'http://127.0.0.1:5000/backend/';
  AXIOS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': false
  }

  async sendTest() {
    axios({
      method: 'get',
      url: this.BASE_URL,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  async calcDistance(): Promise<AxiosResponse<string>> {
    return axios({
      method: 'get',
      url: this.BASE_URL + "calc-distance",
      params: {
        firstX: 0,
        firstY: 0,
        secondX: 100,
        secondY: 100,
        homographyMatrixFile: "C:\\Users\\tyler\\Documents\\Repos\\electron-driving-app\\resources\\homography_matrices\\video_001_homography_matrix.json"
      },
      data: {},
      headers: this.AXIOS_HEADERS,
    });
  }

  async calibrate(file: File, calibrationPoints: XY[]): Promise<AxiosResponse<string>> {
    return axios({
      method: 'post',
      url: this.BASE_URL + "calibrate",
      headers: this.AXIOS_HEADERS,
      data: {
        calibrationPoints: calibrationPoints,
        realWorldPoints: [new XY(0, 0), new XY(100, 0), new XY(0, 200), new XY(100, 200)],
        videoFileName: file.name,
        testPoints: [new XY(0, 0), new XY(100, 0)],
      }
    });
  }

  async processVideo(homographyFileName): Promise<AxiosResponse<string>> {
    return axios({
      method: 'post',
      url: this.BASE_URL + "process-video",
      headers: this.AXIOS_HEADERS,
      data: {
        homographyMatrixFile: homographyFileName,
        cropTopLeft: new XY(360, 0),
        cropBottomRight: new XY(720, 640),
        wheelPosition: new XY(396, 333)
      }
    });
  }
}