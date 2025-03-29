import { CalibrationVideo } from "./calibration-video/calibration-video";
import './content-panel.css'

export function ContentPanel() {
    return (
        <>
            <div className="content-panel">
                <CalibrationVideo></CalibrationVideo>
            </div>
        </>
    )
}