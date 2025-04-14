import { useEffect, useRef, useState } from "react"
import { ServiceProvider } from "../../../../../services/service-provider.service";
import './video-canvas-thumbnail.css'
import { XY } from "../../../../../models/xy.model";
import { BaseContentService } from "../../../../../services/base-content.service";


interface VideoCanvasThumbnailProps {
    image: CanvasImageSource,
    xy: XY,
    width: number,
    height: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    eventEmitterService: BaseContentService
}

export function VideoCanvasThumbnail({ image, xy, width, height, sx, sy, sw, sh, eventEmitterService }: VideoCanvasThumbnailProps) {
    const [selected, setSelected] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let sub = eventEmitterService.videoSectionEmitter.listenForUpdates((selectedXy) => {
            setSelected(!selected && selectedXy == xy);
        });
        let canvasCtx = canvasRef?.current?.getContext('2d');
        canvasCtx?.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
        return () => {
            sub.unsubscribe();
        }
    });

    function onclick() {
        eventEmitterService.videoSectionEmitter.update(xy)
    }

    return (
        <>
            <div className={"thumb-canvas-container " + (selected ? "selected" : "")} onClick={onclick}>
                <canvas height={height} width={width} ref={canvasRef}></canvas>
            </div>
        </>
    )
}