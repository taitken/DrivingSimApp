import { XY } from "../models/xy.model";
import { EventEmitter } from "../utility/event-emitter";

export abstract class BaseContentService {
    public videoFileEmitter: EventEmitter<File> = new EventEmitter<File>(null);
    public selectedVideoSectionEmitter: EventEmitter<XY> = new EventEmitter<XY>(null);
    public croppedVideoSections: EventEmitter<XY> = new EventEmitter<XY>(null);
    public selectedCanvasPointsEmitter: EventEmitter<XY[]> = new EventEmitter<XY[]>([]);
    public selectedHomographyFile: EventEmitter<string> = new EventEmitter<string>(null);
    
    public abstract resetEmitters();

    public abstract nextStep(stepsToAdd?: number);
}