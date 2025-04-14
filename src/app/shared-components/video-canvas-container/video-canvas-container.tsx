import { useState } from "react";
import { VideoCanvas } from "./video-canvas/video-canvas";
import { XY } from "../../../models/xy.model";
import { BaseContentService } from "../../../services/base-content.service";

export function VideoCanvasContainer({eventEmitterService} : {eventEmitterService: BaseContentService}) {
    const [rowCols, setRowCols] = useState(new XY(2, 2));

    return (
        <>
            <div className="mb-2">
                <label className="me-2">
                    Columns: <input name="myInput" value={rowCols.x} onChange={(e) => { setRowCols(new XY(+e.target.value, rowCols.y)) }} />
                </label>
                <label>
                    Rows: <input name="myInput" value={rowCols.y} onChange={(e) => { setRowCols(new XY(rowCols.x, +e.target.value)) }} />
                </label>
            </div>
            <VideoCanvas eventEmitterService={eventEmitterService} rowCols={rowCols}></VideoCanvas>
        </>
    )
}