import { useEffect, useState } from "react";
import { SelectVideoBox } from "../../../shared-components/select-video-box/select-video-box";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { CalibrationCreationSteps } from "../../../../services/calibration-creation.service";
import { CalibrationCreationSelectPoints } from "./calibration-creation-select-points/calibration-creation-select-points";


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
        ServiceProvider.calibrationCreationService.stepEmitter.update(CalibrationCreationSteps.SELECT_SECTION);
    }

    return (
        <>
            {selectedStep == CalibrationCreationSteps.UPLOAD_VIDEO && <SelectVideoBox videoSelectFunc={onVideoSelect}></SelectVideoBox>}
            {selectedStep == CalibrationCreationSteps.SELECT_SECTION && <CalibrationCreationSelectPoints ></CalibrationCreationSelectPoints>}
        </>
    )
}