import './content-panel.css'
import { VideoProcessing } from "./video-processing/video-processing";
import { ContentDisplayed } from "../../../models/enums/content-displayed";
import { CalibrationCreationContent } from "./calibration-creation-content/calibration-creation-content";
import { CalibrationTestingContent } from './calibration-testing-content/calibration-testing-content';

export function ContentPanel({contentDisplayed}: { contentDisplayed: ContentDisplayed }) {

    return (
        <>
            <div className="content-panel">
                {contentDisplayed == ContentDisplayed.CALIBRATION_CREATION && <CalibrationCreationContent></CalibrationCreationContent>}
                {contentDisplayed == ContentDisplayed.CALIBRATION_TESTING && <CalibrationTestingContent></CalibrationTestingContent>}
                {contentDisplayed == ContentDisplayed.VIDEO_PROCESSING && <VideoProcessing></VideoProcessing>}
            </div>
        </>
    )
}