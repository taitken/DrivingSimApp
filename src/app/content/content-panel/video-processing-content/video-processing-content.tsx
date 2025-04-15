import { useState, useEffect } from "react";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { VideoProcessingFilePicker } from "./steps/video-processing-file-picker";
import { VideoProcessingSteps } from "../../../../services/video-processing.service";
import { VideoProcessingSelectPoints } from "./steps/video-processing-select-points";
import { VideoProcessingVideoPicker } from "./steps/video-processing-video-picker";

export function VideoProcessingContent() {
    const [selectedStep, setSelectedStep] = useState(null)

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
            {selectedStep == VideoProcessingSteps.PICK_CALIBRATION_FILE && <VideoProcessingFilePicker></VideoProcessingFilePicker>}
            {selectedStep == VideoProcessingSteps.PICK_VIDEO && <VideoProcessingVideoPicker></VideoProcessingVideoPicker>}
            {selectedStep == VideoProcessingSteps.SELECT_WHEEL_POSITION && <VideoProcessingSelectPoints ></VideoProcessingSelectPoints>}
        </>
    )

}

