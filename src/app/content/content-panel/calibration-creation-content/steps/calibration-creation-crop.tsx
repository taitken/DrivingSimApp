import { ServiceProvider } from "../../../../../services/service-provider.service";
import { VideoCropperContainer } from "../../../../shared-components/video-cropper/video-cropper-container";


export function CalibrationCreationCrop() {

    return (
        <>
            <VideoCropperContainer eventEmitterService={ServiceProvider.calibrationCreationService}></VideoCropperContainer>
        </>
    )
}