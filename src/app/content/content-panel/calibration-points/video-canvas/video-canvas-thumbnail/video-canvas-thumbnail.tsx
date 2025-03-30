import { useEffect, useRef, useState } from "react"
import { ServiceProvider } from "../../../../../../services/service-provider.service";
import { StateTrigger } from "../../../../../../services/state.service";
import './video-canvas-thumbnail.css'
import { xy } from "../../../../../../models/xy.model";


interface VideoCanvasThumbnailProps {
    image: CanvasImageSource,
    xy: xy,
    width: number,
    height: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number
}

export function VideoCanvasThumbnail({ image, xy, width, height, sx, sy, sw, sh }: VideoCanvasThumbnailProps) {
    const [selected, setSelected] = useState(false);
    const stateService = ServiceProvider.stateService;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        stateService.subscribeToStateTrigger(StateTrigger.VIDEO_SECTION_SELECTED, (selectedXy) => {
            setSelected(!selected && selectedXy == xy);
        });
        let canvasCtx = canvasRef?.current?.getContext('2d');
        canvasCtx?.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
    });

    function onclick() {
        stateService.updateState(StateTrigger.VIDEO_SECTION_SELECTED, xy)
    }

    return (
        <>
            <div className={"thumb-canvas-container " + (selected ? "selected" : "")} onClick={onclick}>
                <canvas height={height} width={width} ref={canvasRef}></canvas>
            </div>
        </>
    )
}