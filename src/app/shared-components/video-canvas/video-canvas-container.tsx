import { useState } from "react";
import { VideoCanvas } from "./video-canvas";
import { XY } from "../../../models/xy.model";
import { BaseContentService } from "../../../services/base-content.service";
import { UiButton } from "../../ui/ui-button/ui-button";

export function VideoCanvasContainer({ eventEmitterService, numberSelectedPoints, description }: { eventEmitterService: BaseContentService, numberSelectedPoints: number, description: string }) {
    function confirmSelection()
    {

    }

    return (
        <>
            <div className="content-container">
                <h3 >Select Points</h3>
                <p>{description}</p>
                <VideoCanvas eventEmitterService={eventEmitterService} numberSelectedPoints={numberSelectedPoints}></VideoCanvas>
                <UiButton size="lg" style="accent" className='mt-3 ms-auto' onClick={confirmSelection}>Confirm</UiButton>
            </div>

        </>
    )
}