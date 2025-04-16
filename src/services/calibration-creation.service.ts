import { Dimensions } from "../models/dimension.model";
import { XY } from "../models/xy.model";
import { EventEmitter } from "../utility/event-emitter";
import { BaseContentService } from "./base-content.service";

export enum CalibrationCreationSteps {
  UPLOAD_VIDEO = 1,
  CROP_VIDEO,
  SELECT_FOUR_POINTS,
  ENTER_REAL_WORLD_MEASUREMENTS,
  CONFIRM
}

export class CalibrationCreationService extends BaseContentService {
  public stepEmitter: EventEmitter<CalibrationCreationSteps> = new EventEmitter<CalibrationCreationSteps>(CalibrationCreationSteps.UPLOAD_VIDEO);
  public realWorldDimensionsEmitter: EventEmitter<Dimensions> = new EventEmitter<Dimensions>(null);
  public nextStep(stepsToAdd?: number) {
    this.stepEmitter.update(this.stepEmitter.getValue() + (stepsToAdd ?? 1))
  }

  public resetEmitters() {
    super.resetEmitters();
    this.stepEmitter.update(CalibrationCreationSteps.UPLOAD_VIDEO);
  }
}