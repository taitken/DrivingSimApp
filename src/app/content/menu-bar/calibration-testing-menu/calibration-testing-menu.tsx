import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { XY } from "../../../../models/xy.model";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { UiButton } from "../../../ui/ui-button/ui-button";
import { CalibrationTestingSteps } from "../../../../services/calibration-testing.service";

export default function CalibrationTestingMenu() {
    const [currentMenuStep, setMenuStep] = useState(CalibrationTestingSteps.PICK_CALIBRATION_FILE);
    const [returnValue, setReturnValue] = useState('Waiting for API');
    const [selectedPoints, setSelectedPoints] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        let sub1 = ServiceProvider.calibrationTestingService.selectedCanvasPointsEmitter.listenForUpdates((newSelectedPoints) => {
            setSelectedPoints(newSelectedPoints)
        });
        let sub2 = ServiceProvider.calibrationTestingService.stepEmitter.listenForUpdates((newMenuStep: CalibrationTestingSteps) => {
            setMenuStep(newMenuStep)
        });
        let sub3 = ServiceProvider.calibrationTestingService.selectedHomographyFile.listenForUpdates((newFile: string) => {
            setSelectedFile(newFile)
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

    function getMenuHightlight(thisMenuStep: CalibrationTestingSteps, selectedMenuStep: CalibrationTestingSteps): string {
        if (thisMenuStep == selectedMenuStep)
            return "menu-heading-selected";
        if (thisMenuStep < selectedMenuStep)
            return "menu-heading-completed"
        return "";
    }

    function calcDistance() {
        if (!!selectedPoints && !!selectedFile) {
            ServiceProvider.backendService.calcDistance(selectedFile, selectedPoints).then((response) => {
                setReturnValue(response.data);
            })
        }
    }

    function resetToStart() {
        ServiceProvider.calibrationTestingService.resetEmitters();
    }

    return (
        <div className="left-panel">
            <h1>
                <FontAwesomeIcon className="heading-icon" icon={faCamera} />
                Calibration Testing
            </h1>
            <div className="divider"></div>
            <h2 className={getMenuHightlight(CalibrationTestingSteps.PICK_CALIBRATION_FILE, currentMenuStep)}>
                <span className="heading-circle">1</span>
                Select Calibration File
            </h2>
            <div>
                {selectedFile ? selectedFile : "Select file from list."}
            </div>
            <h2 className={getMenuHightlight(CalibrationTestingSteps.PICK_VIDEO, currentMenuStep)}>
                <span className="heading-circle">2</span>
                Select Video For Testing
            </h2>
            <h2 className={getMenuHightlight(CalibrationTestingSteps.SELECT_TWO_POINTS, currentMenuStep)}>
                <span className="heading-circle">3</span>
                Select Two Points
            </h2>
            <div className="w-100 d-flex justify-content-center">
                <div className="mb-3 w-75">
                    <div className="d-flex mb-2">
                        <div className="w-50 d-flex me-2">
                            <label className="me-2 ">1:</label>
                            <input disabled name="myInput" value={getSelectedPointCoorString(selectedPoints ? selectedPoints[0] : new XY(0, 0))} />
                        </div>

                        <div className="w-50 d-flex">
                            <label className="me-2 ">2:</label>
                            <input disabled name="myInput" value={getSelectedPointCoorString(selectedPoints ? selectedPoints[1] : new XY(0, 0))} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <div className="me-1"><UiButton onClick={calcDistance}>Calculate Distance</UiButton></div>
                <div><UiButton onClick={resetToStart}>Reset</UiButton></div>
            </div>
            <div>
                Result: {returnValue}
            </div>
        </div>
    )
}