import './content-panel.css'
import { ContentDisplayed } from "../../../models/enums/content-displayed";
import { CalibrationCreationContent } from "./calibration-creation-content/calibration-creation-content";
import { CalibrationTestingContent } from './calibration-testing-content/calibration-testing-content';
import { VideoProcessingContent } from './video-processing-content/video-processing-content';

export function ContentPanel({contentDisplayed}: { contentDisplayed: ContentDisplayed }) {

    return (
        <>
            <div className="content-panel">
                {contentDisplayed == ContentDisplayed.CALIBRATION_CREATION && <CalibrationCreationContent></CalibrationCreationContent>}
                {contentDisplayed == ContentDisplayed.CALIBRATION_TESTING && <CalibrationTestingContent></CalibrationTestingContent>}
                {contentDisplayed == ContentDisplayed.VIDEO_PROCESSING && <VideoProcessingContent></VideoProcessingContent>}
            </div>
        </>
    )
}