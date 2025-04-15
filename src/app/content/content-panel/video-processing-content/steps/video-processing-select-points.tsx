import { ServiceProvider } from "../../../../../services/service-provider.service";
import { VideoCanvasContainer } from "../../../../shared-components/video-canvas-container/video-canvas-container";


export function VideoProcessingSelectPoints() {

    return (
        <>
            <VideoCanvasContainer eventEmitterService={ServiceProvider.videoProcessingService} numberSelectedPoints={1}></VideoCanvasContainer>
        </>
    )
}