import { CalibrationTestingSteps } from "../../../../../services/calibration-testing.service";
import { ServiceProvider } from "../../../../../services/service-provider.service";
import { SelectVideoBox } from "../../../../shared-components/select-video-box/select-video-box";


export function CalibrationTestingVideoPicker() {

    function onSelectVideo(file: File) {
        ServiceProvider.calibrationTestingService.videoFileEmitter.update(file);
        ServiceProvider.calibrationTestingService.stepEmitter.update(CalibrationTestingSteps.SELECT_TWO_POINTS);
    }

    return (
        <>
            <SelectVideoBox videoSelectFunc={onSelectVideo}></SelectVideoBox>
        </>
    )
}