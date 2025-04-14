import { useEffect, useState } from "react";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { CalibrationTestingSteps } from "../../../../services/calibration-testing.service";
import { CalibrationTestingFilePicker } from "./calibration-testing-file-picker/calibration-testing-file-picker";
import { CalibrationTestingVideoPicker } from "./calibration-testing-video-picker/calibration-testing-video-picker";
import { CalibrationTestingSelectPoints } from "./calibration-testing-select-points/calibration-testing-select-points";


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
            {selectedStep == CalibrationTestingSteps.SELECT_TWO_POINTS && <CalibrationTestingSelectPoints ></CalibrationTestingSelectPoints>}
        </>
    )
}