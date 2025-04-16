import { useEffect, useState } from "react";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { CalibrationTestingSteps } from "../../../../services/calibration-testing.service";
import { SelectVideoBoxContainer } from "../../../shared-components/select-video-box/select-video-box-container";
import { VideoCanvasContainer } from "../../../shared-components/video-canvas/video-canvas-container";
import { CalibrationFilePickerContainer } from "../../../shared-components/calibration-file-picker/calibrtion-file-picker-container";
import { VideoCropperContainer } from "../../../shared-components/video-cropper/video-cropper-container";
import { CalibrationTestingResult } from "./calibration-testing-results";


export function CalibrationTestingContent() {
    const [selectedStep, setSelectedStep] = useState(null)
    const selectPointsDesc = "Please select each end of an object with a known real world length. The distance calculation will be performed using the previously selected homography matrix file, which can be used to validate it's accuracy.";
    let eventEmitterService = ServiceProvider.calibrationTestingService;

    useEffect(() => {
        let sub1 = ServiceProvider.calibrationTestingService.stepEmitter.listenForUpdateAndExecuteImmediately((newStep => {
            setSelectedStep(newStep);
        }));
        return () => {
            sub1.unsubscribe();
        }
    }, []);


    return (
        <>
            {selectedStep == CalibrationTestingSteps.PICK_CALIBRATION_FILE && <CalibrationFilePickerContainer eventEmitterService={eventEmitterService}></CalibrationFilePickerContainer>}
            {selectedStep == CalibrationTestingSteps.PICK_VIDEO && <SelectVideoBoxContainer eventEmitterService={eventEmitterService}></SelectVideoBoxContainer>}
            {selectedStep == CalibrationTestingSteps.CROP_VIDEO && <VideoCropperContainer eventEmitterService={eventEmitterService}></VideoCropperContainer>}
            {selectedStep == CalibrationTestingSteps.SELECT_TWO_POINTS && <VideoCanvasContainer eventEmitterService={eventEmitterService} numberSelectedPoints={2} description={selectPointsDesc}></VideoCanvasContainer>}
            {selectedStep == CalibrationTestingSteps.RESULT && <CalibrationTestingResult></CalibrationTestingResult>}
        </>
    )
}