import { CalibrationTestingSteps } from "../../../../../services/calibration-testing.service";
import { ServiceProvider } from "../../../../../services/service-provider.service";
import { VideoProcessingSteps } from "../../../../../services/video-processing.service";
import { SelectVideoBox } from "../../../../shared-components/select-video-box/select-video-box";


export function VideoProcessingVideoPicker() {

    function onSelectVideo(file: File) {
        ServiceProvider.videoProcessingService.videoFileEmitter.update(file);
        ServiceProvider.videoProcessingService.stepEmitter.update(VideoProcessingSteps.SELECT_WHEEL_POSITION);
    }

    return (
        <>
            <SelectVideoBox videoSelectFunc={onSelectVideo}></SelectVideoBox>
        </>
    )
}