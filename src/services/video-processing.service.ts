import { BaseContentService } from "./base-content.service";

export enum VideoProcessingSteps{
  PICK_CALIBRATION_FILE,
  PICK_VIDEO,
  SELECT_TWO_POINTS
}

export class VideoProcessingService extends BaseContentService{

}