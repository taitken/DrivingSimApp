
import { ContentDisplayed } from '../../../models/enums/content-displayed';
import CalibrationCreationMenu from './calibration-creation-menu/calibration-creation-menu';
import CalibrationTestingMenu from './calibration-testing-menu/calibration-testing-menu';
import './menu-bar.css';
import VideoProcessingMenu from './video-processing-menu/video-processing-menu';

export default function MenuBar({contentDisplayed}: { contentDisplayed: ContentDisplayed }) {

    return (
        <>
                {contentDisplayed == ContentDisplayed.CALIBRATION_CREATION && <CalibrationCreationMenu></CalibrationCreationMenu>}
                {contentDisplayed == ContentDisplayed.CALIBRATION_TESTING && <CalibrationTestingMenu></CalibrationTestingMenu>}
                {contentDisplayed == ContentDisplayed.VIDEO_PROCESSING && <VideoProcessingMenu></VideoProcessingMenu>}
        </>
    )
}