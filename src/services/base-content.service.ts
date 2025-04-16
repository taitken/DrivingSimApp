import { Dimensions } from "../models/dimension.model";
import { XY } from "../models/xy.model";
import { EventEmitter } from "../utility/event-emitter";

export abstract class BaseContentService {
    public videoFileEmitter: EventEmitter<File> = new EventEmitter<File>(null);
    public selectedVideoSectionEmitter: EventEmitter<XY> = new EventEmitter<XY>(null);
    public croppedVideoSections: EventEmitter<XY> = new EventEmitter<XY>(null);
    public selectedCanvasPointsEmitter: EventEmitter<XY[]> = new EventEmitter<XY[]>([]);
    public selectedHomographyFile: EventEmitter<string> = new EventEmitter<string>(null);
    public videoDimensions: EventEmitter<Dimensions> = new EventEmitter<Dimensions>(null);
    
    public resetEmitters()
    {
        this.videoFileEmitter.update(null);
        this.selectedVideoSectionEmitter.update(null);
        this.selectedCanvasPointsEmitter.update([]);
        this.croppedVideoSections.update(null);
        this.selectedHomographyFile.update(null);
        this.videoDimensions.update(null);
    }

    public selectFile(input: HTMLInputElement, handleFileFunc?: (file: File)=>void): void
    {
        input.click();
    }

    public abstract nextStep(stepsToAdd?: number);
}