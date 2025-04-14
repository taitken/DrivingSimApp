import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { XY } from "../../../../models/xy.model";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { UiButton } from "../../../ui/ui-button/ui-button";
import { VideoProcessingSteps } from "../../../../services/video-processing.service";

export default function CalibrationTestingMenu() {
    const [currentMenuStep, setMenuStep] = useState(VideoProcessingSteps.PICK_CALIBRATION_FILE);
    const [returnValue, setReturnValue] = useState('Waiting for API');
    const [videoFile, setVideoFile] = useState(null);
    const [selectedPoints, setSelectedPoints] = useState([new XY(0, 0), new XY(0, 0), new XY(0, 0), new XY(0, 0)]);

    useEffect(() => {
        let sub1 = ServiceProvider.videoProcessingService.selectedCanvasPointsEmitter.listenForUpdates((newSelectedPoints) => {
            setSelectedPoints(newSelectedPoints)
        });
        let sub2 = ServiceProvider.videoProcessingService.stepEmitter.listenForUpdates((newMenuStep: VideoProcessingSteps) => {
            setMenuStep(newMenuStep)
        });
        let sub3 = ServiceProvider.videoProcessingService.videoFileEmitter.listenForUpdates((file) => {
            setVideoFile(file)
        });
        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
            sub3.unsubscribe();
        }
    });

    function getSelectedPointCoorString(points: XY) {
        if (points == null)
            return "0, 0"

        return Math.round(points.x).toString() + ", " + Math.round(points.y).toString()
    }

    function getMenuHightlight(thisMenuStep: VideoProcessingSteps, selectedMenuStep: VideoProcessingSteps): string {
        if (thisMenuStep == selectedMenuStep)
            return "menu-heading-selected";
        if (thisMenuStep < selectedMenuStep)
            return "menu-heading-completed"
        return "";
    }

    function resetToStart() {
        ServiceProvider.videoProcessingService.resetEmitters();
    }

    return (
        <div className="left-panel">
            <h1>
                <FontAwesomeIcon className="heading-icon" icon={faCamera} />
                Video Processing
            </h1>
            <div className="divider"></div>
            <h2 className={getMenuHightlight(VideoProcessingSteps.PICK_CALIBRATION_FILE, currentMenuStep)}>
                <span className="heading-circle">1</span>
                Select Calibration File
            </h2>
            <h2 className={getMenuHightlight(VideoProcessingSteps.PICK_VIDEO, currentMenuStep)}>
                <span className="heading-circle">2</span>
                Select Video For Testing
            </h2>
            <h2 className={getMenuHightlight(VideoProcessingSteps.SELECT_WHEEL_POSITION, currentMenuStep)}>
                <span className="heading-circle">2</span>
                Select wheel position
            </h2>
            <div className="w-100 d-flex justify-content-center">
                <div className="mb-3 w-75">
                    <div className="d-flex justify-content-center mb-2">
                        <input disabled name="myInput" value={getSelectedPointCoorString(selectedPoints ? selectedPoints[0] : new XY(0, 0))} />
                    </div>

                </div>
            </div>

            <div className="d-flex justify-content-center">
                <div className="me-1"><UiButton onClick={resetToStart}>Process Video</UiButton></div>
                <div><UiButton onClick={resetToStart}>Reset</UiButton></div>
            </div>

            <div className="divider"></div>
            <div>{returnValue}</div>
        </div>
    )
}