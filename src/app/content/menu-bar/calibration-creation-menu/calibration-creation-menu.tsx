import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { XY } from "../../../../models/xy.model";
import { CalibrationCreationSteps } from "../../../../services/calibration-creation.service";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { UiButton } from "../../../ui/ui-button/ui-button";

export default function CalibrationCreationMenu() {
    const [currentMenuStep, setMenuStep] = useState(CalibrationCreationSteps.UPLOAD_VIDEO);
    const [returnValue, setReturnValue] = useState('Waiting for API');
    const [selectedPoints, setSelectedPoints] = useState([new XY(0, 0), new XY(0, 0), new XY(0, 0), new XY(0, 0)]);

    useEffect(() => {

        let sub1 = ServiceProvider.calibrationCreationService.stepEmitter.listenForUpdates((newMenuStep: CalibrationCreationSteps) => {
            setMenuStep(newMenuStep)
        });
        return () => {
            sub1.unsubscribe();
        }
    }, []);

    function getMenuHightlight(thisMenuStep: CalibrationCreationSteps, selectedMenuStep: CalibrationCreationSteps): string {
        if (thisMenuStep == selectedMenuStep)
            return "menu-heading-selected";
        if (thisMenuStep < selectedMenuStep)
            return "menu-heading-completed"
        return "";
    }

    function resetToStart() {
        ServiceProvider.calibrationCreationService.resetEmitters();
    }

    return (
        <div className="left-panel">
            <h1>
                <FontAwesomeIcon className="heading-icon" icon={faCamera} />
                Camera Calibration
            </h1>
            <div className="divider"></div>
            <h2 className={getMenuHightlight(CalibrationCreationSteps.UPLOAD_VIDEO, currentMenuStep)}>
                <span className="heading-circle">{CalibrationCreationSteps.UPLOAD_VIDEO.valueOf()}</span>
                Upload calibration video
            </h2>
            <h2 className={getMenuHightlight(CalibrationCreationSteps.CROP_VIDEO, currentMenuStep)}>
                <span className="heading-circle">{CalibrationCreationSteps.CROP_VIDEO.valueOf()}</span>
                Crop Video
            </h2>
            <h2 className={getMenuHightlight(CalibrationCreationSteps.SELECT_FOUR_POINTS, currentMenuStep)}>
                <span className="heading-circle">{CalibrationCreationSteps.SELECT_FOUR_POINTS.valueOf()}</span>
                Select calibration points
            </h2>
            <h2 className={getMenuHightlight(CalibrationCreationSteps.ENTER_REAL_WORLD_MEASUREMENTS, currentMenuStep)}>
                <span className="heading-circle">{CalibrationCreationSteps.ENTER_REAL_WORLD_MEASUREMENTS.valueOf()}</span>
                Enter real world measurements
            </h2>
            <h2 className={getMenuHightlight(CalibrationCreationSteps.CONFIRM, currentMenuStep)}>
                <span className="heading-circle">{CalibrationCreationSteps.CONFIRM.valueOf()}</span>
                Create Homography Matrix
            </h2>
            <div><UiButton onClick={resetToStart}>Reset</UiButton></div>
        </div>
    )
}