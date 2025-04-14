import { EventEmitter } from "../utility/event-emitter";
import { BaseContentService } from "./base-content.service";

export enum CalibrationTestingSteps {
  PICK_CALIBRATION_FILE,
  PICK_VIDEO,
  SELECT_TWO_POINTS
}

export class CalibrationTestingService extends BaseContentService {
  public stepEmitter: EventEmitter<CalibrationTestingSteps> = new EventEmitter<CalibrationTestingSteps>(CalibrationTestingSteps.PICK_CALIBRATION_FILE);
  public selectedHomographyFile: EventEmitter<string> = new EventEmitter<string>(null);

  public resetEmitters() {
    this.videoFileEmitter.update(null);
    this.videoSectionEmitter.update(null);
    this.selectedCanvasPointsEmitter.update(null);
    this.selectedHomographyFile.update(null);
    this.stepEmitter.update(CalibrationTestingSteps.PICK_CALIBRATION_FILE);
  }
}