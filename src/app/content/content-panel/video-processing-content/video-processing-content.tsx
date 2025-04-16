import { useState, useEffect } from "react";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { VideoProcessingSteps } from "../../../../services/video-processing.service";
import { SelectVideoBoxContainer } from "../../../shared-components/select-video-box/select-video-box-container";
import { VideoCanvasContainer } from "../../../shared-components/video-canvas/video-canvas-container";
import { CalibrationFilePickerContainer } from "../../../shared-components/calibration-file-picker/calibrtion-file-picker-container";
import { VideoProcessingResults } from "./video-processing-results";
import { VideoCropperContainer } from "../../../shared-components/video-cropper/video-cropper-container";

export function VideoProcessingContent() {
    const [selectedStep, setSelectedStep] = useState(null)
    let eventEmitterService = ServiceProvider.videoProcessingService;
    const selectPointsDesc = "Please select the position of the tyre. This will be used in the analytics processing as a starting point when calculating distance to the road lane line.";
    

    useEffect(() => {
        let sub1 = ServiceProvider.videoProcessingService.stepEmitter.listenForUpdateAndExecuteImmediately((newStep => {
            setSelectedStep(newStep);
        }));
        return () => {
            sub1.unsubscribe();
        }
    }, []);
    return (
        <>
            {selectedStep == VideoProcessingSteps.PICK_CALIBRATION_FILE && <CalibrationFilePickerContainer eventEmitterService={eventEmitterService}></CalibrationFilePickerContainer>}
            {selectedStep == VideoProcessingSteps.PICK_VIDEO && <SelectVideoBoxContainer eventEmitterService={eventEmitterService}></SelectVideoBoxContainer>}
            {selectedStep == VideoProcessingSteps.CROP_VIDEO && <VideoCropperContainer eventEmitterService={eventEmitterService}></VideoCropperContainer>}
            {selectedStep == VideoProcessingSteps.SELECT_WHEEL_POSITION && <VideoCanvasContainer eventEmitterService={eventEmitterService} numberSelectedPoints={1} description={selectPointsDesc}></VideoCanvasContainer>}
            {selectedStep == VideoProcessingSteps.PROCESS && <VideoProcessingResults></VideoProcessingResults>}
        </>
    )

}

