import { EventEmitter } from "../utility/event-emitter";
import { BaseContentService } from "./base-content.service";

export enum CalibrationTestingSteps {
  PICK_CALIBRATION_FILE,
  PICK_VIDEO,
  CROP_VIDEO,
  SELECT_TWO_POINTS,
  RESULT
}

export class CalibrationTestingService extends BaseContentService {
  public stepEmitter: EventEmitter<CalibrationTestingSteps> = new EventEmitter<CalibrationTestingSteps>(CalibrationTestingSteps.PICK_CALIBRATION_FILE);

  public nextStep(stepsToAdd?: number) {
    this.stepEmitter.update(this.stepEmitter.getValue() + (stepsToAdd ?? 1))
  }

  public resetEmitters() {
    super.resetEmitters();
    this.stepEmitter.update(CalibrationTestingSteps.PICK_CALIBRATION_FILE);
  }
}