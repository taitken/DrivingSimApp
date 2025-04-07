import axios, { AxiosResponse, ResponseType } from "axios";
import { xy } from "../models/xy.model";

export class BackendService {
  BASE_URL: string = 'http://127.0.0.1:5000/backend/';

  async sendTest() {
    axios({
      method: 'get',
      url: this.BASE_URL,
      headers: {"Access-Control-Allow-Origin": "*"},
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
        homographyMatrixFile: "C:\\Users\\tyler\\Documents\\Repos\\electron-driving-app\\backend\\resources\\video_001_homography_matrix.json"
      },
      data: {},
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials':false
      },
    });
  }

  async calibrate(calibrationPoints: xy[]): Promise<AxiosResponse<string>> {
    return axios({
      method: 'post',
      url: this.BASE_URL + "calibrate",
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials':false
      },
      data: {
        calibrationPoints: calibrationPoints,
        realWorldPoints: [new xy(0,0), new xy(100,0), new xy(0,200), new xy(100,200)],
        videoFileName: 'video_001.mvk',
        testPoints: [new xy(0,0), new xy(100,0)],
      }
    });
  }

  async processVideo() : Promise<AxiosResponse<string>> {
    return axios({
      method: 'post',
      url: this.BASE_URL + "process-video",
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials':false
      },
      data: {
        videoFile: "C:\\Users\\tyler\\Documents\\Repos\\DrivingSimApp\\OriginalFiles\\video\\CANTRACK_01_006_V1_D1_2025-03-04 10-51-08.mkv",
        homographyMatrixFile: "C:\\Users\\tyler\\Documents\\Repos\\electron-driving-app\\backend\\resources\\video_001_homography_matrix.json",
        cropTopLeft: new xy(360,0),
        cropBottomRight: new xy(720, 640),
        wheelPosition: new xy(396, 333)
      }
    });
  }
}