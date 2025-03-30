import { useState } from "react";
import { VideoCanvas } from "./video-canvas/video-canvas";
import { xy } from "../../../../models/xy.model";

export function CalibrationPoints() {
    const [rowCols, setRowCols] = useState(new xy(2, 2));

    return (
        <>
            <div className="mb-2">
                <label className="me-2">
                    Columns: <input name="myInput" value={rowCols.x} onChange={(e) => { setRowCols(new xy(+e.target.value, rowCols.y)) }} />
                </label>
                <label>
                    Rows: <input name="myInput" value={rowCols.y} onChange={(e) => { setRowCols(new xy(rowCols.x, +e.target.value)) }} />
                </label>
            </div>
            <VideoCanvas rowCols={rowCols}></VideoCanvas>
        </>
    )
}