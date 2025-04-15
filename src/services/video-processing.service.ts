import { EventEmitter } from "../utility/event-emitter";
import { BaseContentService } from "./base-content.service";

export enum VideoProcessingSteps {
  PICK_CALIBRATION_FILE,
  PICK_VIDEO,
  SELECT_WHEEL_POSITION
}

export class VideoProcessingService extends BaseContentService {
  public stepEmitter: EventEmitter<VideoProcessingSteps> = new EventEmitter<VideoProcessingSteps>(VideoProcessingSteps.PICK_CALIBRATION_FILE);
  public selectedHomographyFile: EventEmitter<string> = new EventEmitter<string>(null);

  public nextStep(stepsToAdd?: number) {
    this.stepEmitter.update(this.stepEmitter.getValue() + (stepsToAdd ?? 1))
  }
  public resetEmitters() {
    this.videoFileEmitter.update(null);
    this.videoSectionEmitter.update(null);
    this.selectedCanvasPointsEmitter.update([]);
    this.selectedHomographyFile.update(null);
    this.stepEmitter.update(VideoProcessingSteps.PICK_CALIBRATION_FILE);
  }
}