import { EventEmitter } from "../utility/event-emitter";
import { BaseContentService } from "./base-content.service";
import { ServiceProvider } from "./service-provider.service";

export enum VideoProcessingSteps {
  PICK_CALIBRATION_FILE,
  PICK_VIDEO,
  CROP_VIDEO,
  SELECT_WHEEL_POSITION,
  PROCESS
}

export class VideoProcessingService extends BaseContentService {
  public stepEmitter: EventEmitter<VideoProcessingSteps> = new EventEmitter<VideoProcessingSteps>(VideoProcessingSteps.PICK_CALIBRATION_FILE);

  public nextStep(stepsToAdd?: number) {
    this.stepEmitter.update(this.stepEmitter.getValue() + (stepsToAdd ?? 1))
  }
  public resetEmitters() {
    super.resetEmitters();
    this.stepEmitter.update(VideoProcessingSteps.PICK_CALIBRATION_FILE);
  }

  public selectFile(input: HTMLInputElement, handleFileFunc?: (file: File)=>void): void
  {
    ServiceProvider.ipcService.copyFileToTmp().then(async result => {
      handleFileFunc(result);
    })
  }

}