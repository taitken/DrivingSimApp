import { useEffect, useState } from "react";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { CalibrationCreationSteps } from "../../../../services/calibration-creation.service";
import { CalibrationCreationEnterRealWorldMeasurements } from "./steps/calibration-creation-enter-real-world-measurements";
import { CalibrationCreationConfirm } from "./steps/calibration-creation-confirm";
import { SelectVideoBoxContainer } from "../../../shared-components/select-video-box/select-video-box-container";
import { VideoCropperContainer } from "../../../shared-components/video-cropper/video-cropper-container";
import { VideoCanvasContainer } from "../../../shared-components/video-canvas/video-canvas-container";


export function CalibrationCreationContent() {
    const [selectedStep, setSelectedStep] = useState(null)
    const selectPointsDesc = "Please select four corners of a real world object with known dimensions. The dimensions selected in pixels from the video will be compared to the real world dimensions to produce a homography matrix file.";
    let eventEmitterService = ServiceProvider.calibrationCreationService;

    useEffect(() => {
        let sub1 = ServiceProvider.calibrationCreationService.stepEmitter.listenForUpdateAndExecuteImmediately((newStep => {
            setSelectedStep(newStep);
        }));
        return () => {
            sub1.unsubscribe();
        }
    }, []);

    return (
        <>
            {selectedStep == CalibrationCreationSteps.UPLOAD_VIDEO && <SelectVideoBoxContainer eventEmitterService={eventEmitterService}></SelectVideoBoxContainer>}
            {selectedStep == CalibrationCreationSteps.CROP_VIDEO && <VideoCropperContainer eventEmitterService={eventEmitterService}></VideoCropperContainer>}
            {selectedStep == CalibrationCreationSteps.SELECT_FOUR_POINTS && <VideoCanvasContainer eventEmitterService={eventEmitterService} numberSelectedPoints={4} description={selectPointsDesc}></VideoCanvasContainer>}
            {selectedStep == CalibrationCreationSteps.ENTER_REAL_WORLD_MEASUREMENTS && <CalibrationCreationEnterRealWorldMeasurements ></CalibrationCreationEnterRealWorldMeasurements>}
            {selectedStep == CalibrationCreationSteps.CONFIRM && <CalibrationCreationConfirm ></CalibrationCreationConfirm>}
        </>
    )
}