import axios, { AxiosHeaders, AxiosResponse, ResponseType } from "axios";
import { XY } from "../models/xy.model";
import { Dimensions } from "../models/dimension.model";

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

  async calcDistance(homographyFile: string, selectedPoints: XY[]): Promise<AxiosResponse<string>> {
    return axios({
      method: 'get',
      url: this.BASE_URL + "calc-distance",
      params: {
        firstX: selectedPoints[0].x,
        firstY: selectedPoints[0].y,
        secondX: selectedPoints[1].x,
        secondY: selectedPoints[1].y,
        homographyMatrixFile: homographyFile
      },
      data: {},
      headers: this.AXIOS_HEADERS,
    });
  }

  async calibrate(file: File, calibrationPoints: XY[], realWorldDimensions: Dimensions): Promise<AxiosResponse<string>> {
    return axios({
      method: 'post',
      url: this.BASE_URL + "calibrate",
      headers: this.AXIOS_HEADERS,
      data: {
        calibrationPoints: calibrationPoints,
        realWorldPoints: [new XY(0, 0), new XY(realWorldDimensions.height, 0), new XY(0, realWorldDimensions.width), new XY(realWorldDimensions.height, realWorldDimensions.width)],
        videoFileName: file.name
      }
    });
  }

  async processVideo(homographyFileName, videoFileName, cropTopLeft: XY, cropBottomRight: XY, wheelPosition: XY): Promise<AxiosResponse<string>> {
    return axios({
      method: 'post',
      url: this.BASE_URL + "process-video",
      headers: this.AXIOS_HEADERS,
      data: {
        homographyMatrixFile: homographyFileName,
        videoFileName: videoFileName,
        cropTopLeft: cropTopLeft,
        cropBottomRight: cropBottomRight,
        wheelPosition: wheelPosition
      }
    });
  }
}