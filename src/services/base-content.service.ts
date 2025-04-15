import { XY } from "../models/xy.model";
import { EventEmitter } from "../utility/event-emitter";

export abstract class BaseContentService {
    public videoFileEmitter: EventEmitter<File> = new EventEmitter<File>(null);
    public videoSectionEmitter: EventEmitter<XY> = new EventEmitter<XY>(null);
    public selectedCanvasPointsEmitter: EventEmitter<XY[]> = new EventEmitter<XY[]>([]);
    
    public abstract resetEmitters();

    public abstract nextStep(stepsToAdd?: number);
}