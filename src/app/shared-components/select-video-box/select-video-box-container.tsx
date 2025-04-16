import './select-video-box.css'
import { SelectVideoBox } from "./select-video-box";
import { BaseContentService } from "../../../services/base-content.service";

export function SelectVideoBoxContainer({ eventEmitterService }: { eventEmitterService: BaseContentService }) {

    function onVideoSelect(videoSelected: File) {
        eventEmitterService.videoFileEmitter.update(videoSelected);
        eventEmitterService.nextStep();
    }

    return (
        <>
            <h3 className="text-primary">Select Video</h3>
            <p>Please select a video file either by dragging and dropping the file into the area below, or clicking the area below to bring up the file explorer.</p>
            <div className="canvas-container">
                <SelectVideoBox videoSelectFunc={onVideoSelect} eventEmitterService={eventEmitterService}></SelectVideoBox>
            </div >
        </>
    )
}