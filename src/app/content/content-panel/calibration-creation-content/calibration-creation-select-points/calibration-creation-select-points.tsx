import { useState } from "react";
import { XY } from "../../../../../models/xy.model";
import { VideoCanvasContainer } from "../../../../shared-components/video-canvas-container/video-canvas-container";
import { ServiceProvider } from "../../../../../services/service-provider.service";

export function CalibrationCreationSelectPoints() {
    return (
        <>
            <VideoCanvasContainer eventEmitterService={ServiceProvider.calibrationCreationService}></VideoCanvasContainer>
        </>
    )
}