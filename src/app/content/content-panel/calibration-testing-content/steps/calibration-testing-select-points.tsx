import { ServiceProvider } from "../../../../../services/service-provider.service";
import { VideoCanvasContainer } from "../../../../shared-components/video-canvas-container/video-canvas-container";


export function CalibrationTestingSelectPoints() {

    return (
        <>
            <VideoCanvasContainer eventEmitterService={ServiceProvider.calibrationTestingService} numberSelectedPoints={2}></VideoCanvasContainer>
        </>
    )
}