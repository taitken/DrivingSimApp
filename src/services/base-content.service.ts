import { XY } from "../models/xy.model";
import { EventEmitter } from "../utility/event-emitter";

export class BaseContentService {
    public videoFileEmitter: EventEmitter<File> = new EventEmitter<File>(null);
    public videoSectionEmitter: EventEmitter<XY> = new EventEmitter<XY>(null);
    public selectedCanvasPointsEmitter: EventEmitter<XY[]> = new EventEmitter<XY[]>([]);
}