import { XY } from "../models/xy.model";
import { EventEmitter } from "../utility/event-emitter";
import { BaseContentService } from "./base-content.service";

export enum CalibrationCreationSteps {
  UPLOAD_VIDEO,
  SELECT_SECTION,
  SELECT_FOUR_POINTS
}

export class CalibrationCreationService extends BaseContentService {
    public stepEmitter: EventEmitter<CalibrationCreationSteps> = new EventEmitter<CalibrationCreationSteps>(CalibrationCreationSteps.UPLOAD_VIDEO);
    
    public resetEmitters()
    {
      this.videoFileEmitter.update(null);
      this.videoSectionEmitter.update(null);
      this.selectedCanvasPointsEmitter.update(null);
      this.stepEmitter.update(CalibrationCreationSteps.UPLOAD_VIDEO);
    }
}