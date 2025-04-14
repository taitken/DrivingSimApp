import { XY } from "../models/xy.model";
import { EventEmitter } from "../utility/event-emitter";

export enum CalibrationCreationSteps {
  UPLOAD_VIDEO,
  SELECT_SECTION,
  SELECT_FOUR_POINTS
}

export class CalibrationCreationService {
    public stepEmitter: EventEmitter<CalibrationCreationSteps> = new EventEmitter<CalibrationCreationSteps>(CalibrationCreationSteps.UPLOAD_VIDEO);
    public videoFileEmitter: EventEmitter<File> = new EventEmitter<File>(null);
    public videoSectionEmitter: EventEmitter<XY> = new EventEmitter<XY>(null);
    public calibrationPointsEmitter: EventEmitter<XY[]> = new EventEmitter<XY[]>([]);
}