import { useEffect, useState } from "react";
import { SelectVideoBox } from "../../../shared-components/select-video-box/select-video-box";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { CalibrationCreationSteps } from "../../../../services/calibration-creation.service";
import { CalibrationCreationSelectPoints } from "./steps/calibration-creation-select-points";
import { CalibrationCreationEnterRealWorldMeasurements } from "./steps/calibration-creation-enter-real-world-measurements";
import { CalibrationCreationCrop } from "./steps/calibration-creation-crop";
import { CalibrationCreationConfirm } from "./steps/calibration-creation-confirm";


export function CalibrationCreationContent() {
    const [selectedStep, setSelectedStep] = useState(null)

    useEffect(() => {
        let sub1 = ServiceProvider.calibrationCreationService.stepEmitter.listenForUpdateAndExecuteImmediately((newStep => {
            setSelectedStep(newStep);
        }));
        return () => {
            sub1.unsubscribe();
        }
    }, []);

    function onVideoSelect(videoSelected: File) {
        ServiceProvider.calibrationCreationService.videoFileEmitter.update(videoSelected);
        ServiceProvider.calibrationCreationService.stepEmitter.update(CalibrationCreationSteps.CROP_VIDEO);
    }

    return (
        <>
            {selectedStep == CalibrationCreationSteps.UPLOAD_VIDEO && <SelectVideoBox videoSelectFunc={onVideoSelect}></SelectVideoBox>}
            {selectedStep == CalibrationCreationSteps.CROP_VIDEO && <CalibrationCreationCrop ></CalibrationCreationCrop>}
            {selectedStep == CalibrationCreationSteps.SELECT_FOUR_POINTS && <CalibrationCreationSelectPoints ></CalibrationCreationSelectPoints>}
            {selectedStep == CalibrationCreationSteps.ENTER_REAL_WORLD_MEASUREMENTS && <CalibrationCreationEnterRealWorldMeasurements ></CalibrationCreationEnterRealWorldMeasurements>}
            {selectedStep == CalibrationCreationSteps.CONFIRM && <CalibrationCreationConfirm ></CalibrationCreationConfirm>}
        </>
    )
}