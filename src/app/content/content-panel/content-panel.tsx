import { CalibrationVideo } from "./calibration-video/calibration-video";
import './content-panel.css'
import { FilePickerTable } from "./file-picker-table/file-picker-table";
import { VideoProcessing } from "./video-processing/video-processing";
import { ContentDisplayed } from "../../../models/enums/content-displayed";

export function ContentPanel({contentDisplayed}: { contentDisplayed: ContentDisplayed }) {

    return (
        <>
            <div className="content-panel">
                {contentDisplayed == ContentDisplayed.CALIBRATION_CREATION && <CalibrationVideo></CalibrationVideo>}
                {contentDisplayed == ContentDisplayed.CALIBRATION_TESTING && <FilePickerTable></FilePickerTable>}
                {contentDisplayed == ContentDisplayed.VIDEO_PROCESSING && <VideoProcessing></VideoProcessing>}
            </div>
        </>
    )
}