import { useEffect, useState } from "react";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { CalibrationTestingSteps } from "../../../../services/calibration-testing.service";
import { SelectVideoBox } from "../../../shared-components/select-video-box/select-video-box";
import { CalibrationTestingFilePicker } from "./calibration-testing-file-picker/calibration-testing-file-picker";
import { CalibrationTestingVideoPicker } from "./calibration-testing-video-picker/calibration-testing-video-picker";


export function CalibrationTestingContent() {
    const [selectedStep, setSelectedStep] = useState(null)

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
            {selectedStep == CalibrationTestingSteps.PICK_CALIBRATION_FILE && <CalibrationTestingFilePicker></CalibrationTestingFilePicker>}
            {selectedStep == CalibrationTestingSteps.PICK_VIDEO && <CalibrationTestingVideoPicker ></CalibrationTestingVideoPicker>}
        </>
    )
}