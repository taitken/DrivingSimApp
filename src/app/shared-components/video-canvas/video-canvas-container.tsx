import { VideoCanvas } from "./video-canvas";
import { BaseContentService } from "../../../services/base-content.service";
import { UiButton } from "../../ui/ui-button/ui-button";
import { useEffect, useState } from "react";

export function VideoCanvasContainer({ eventEmitterService, numberSelectedPoints, description }: { eventEmitterService: BaseContentService, numberSelectedPoints: number, description: string }) {
    const [selectedPoints, setSelectedPoints] = useState(null)

    useEffect(() => {
        let sub1 = eventEmitterService.selectedCanvasPointsEmitter.listenForUpdates((selectedPoints => {
            setSelectedPoints(selectedPoints);
        }));
        return () => {
            sub1.unsubscribe();
        }
    }, []);

    function confirmSelection() {
        eventEmitterService.nextStep();
    }

    return (
        <>
            <h3 className="text-primary">Select Points</h3>
            <p>{description}</p>
            <VideoCanvas eventEmitterService={eventEmitterService} numberSelectedPoints={numberSelectedPoints}></VideoCanvas>
            <div className="footer ms-auto mt-4 ">
                <UiButton size="lg" style="accent" className='mt-4 ms-auto' disabled={selectedPoints?.length != numberSelectedPoints} onClick={confirmSelection}>Confirm</UiButton>
            </div>
        </>
    )
}