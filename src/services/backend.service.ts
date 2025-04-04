import axios from "axios";
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

  async sendAxios(calibrationPoints: xy[]) {
    axios({
      method: 'post',
      url: this.BASE_URL + "vidya",
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
}