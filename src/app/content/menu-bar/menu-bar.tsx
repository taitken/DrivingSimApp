import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './menu-bar.css';
import { UiButton } from "../../ui/ui-button/ui-button";
import { useEffect, useState } from "react";
import { ServiceProvider } from "../../../services/service-provider.service";
import { CalibrationCreationSteps } from "../../../services/calibration-creation.service";
import { XY } from "../../../models/xy.model";

export default function MenuBar() {
    const [currentMenuStep, setMenuStep] = useState(CalibrationCreationSteps.UPLOAD_VIDEO);
    const [returnValue, setReturnValue] = useState('Waiting for API');
    const [videoFile, setVideoFile] = useState(null);
    const [selectedPoints, setSelectedPoints] = useState([new XY(0, 0), new XY(0, 0), new XY(0, 0), new XY(0, 0)]);

    useEffect(() => {
        let sub1 = ServiceProvider.calibrationCreationService.selectedCanvasPointsEmitter.listenForUpdates((newSelectedPoints) => {
            setSelectedPoints(newSelectedPoints)
        });
        let sub2 = ServiceProvider.calibrationCreationService.stepEmitter.listenForUpdates((newMenuStep: CalibrationCreationSteps) => {
            setMenuStep(newMenuStep)
        });
        let sub3 = ServiceProvider.calibrationCreationService.videoFileEmitter.listenForUpdates((file) => {
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

    function getMenuHightlight(thisMenuStep: CalibrationCreationSteps, selectedMenuStep: CalibrationCreationSteps): string {
        if (thisMenuStep == selectedMenuStep)
            return "menu-heading-selected";
        if (thisMenuStep < selectedMenuStep)
            return "menu-heading-completed"
        return "";
    }

    function calibrateData() {
        if (selectedPoints.length == 4
            && (
                selectedPoints[0].x != 0 && selectedPoints[0].y != 0 &&
                selectedPoints[1].x != 0 && selectedPoints[1].y != 0 &&
                selectedPoints[2].x != 0 && selectedPoints[2].y != 0 &&
                selectedPoints[3].x != 0 && selectedPoints[3].y != 0
            )
        ) {
            ServiceProvider.backendService.calibrate(videoFile, selectedPoints).then((response) => {
                setReturnValue(response.data);
            });
        }
    }

    function calcDistance() {
        ServiceProvider.backendService.calcDistance().then((response) => {
            setReturnValue(response.data);
        })
        console.log(videoFile)
        window["ipcRenderer"].invokeSaveVideoFile(videoFile)
            .then((result: string[]) => {
            })
            .catch((e) => {
                console.log(e);
            })
    }

    function resetToStart() {
        ServiceProvider.calibrationCreationService.stepEmitter.update(CalibrationCreationSteps.UPLOAD_VIDEO);
        ServiceProvider.calibrationCreationService.selectedCanvasPointsEmitter.update([]);
    }

    return (
        <div className="left-panel">
            <h1>
                <FontAwesomeIcon className="heading-icon" icon={faCamera} />
                Camera Calibration
            </h1>
            <div className="divider"></div>
            <h2 className={getMenuHightlight(CalibrationCreationSteps.UPLOAD_VIDEO, currentMenuStep)}>
                <span className="heading-circle">1</span>
                Upload calibration video
            </h2>
            <h2 className={getMenuHightlight(CalibrationCreationSteps.SELECT_FOUR_POINTS, currentMenuStep)}>
                <span className="heading-circle">2</span>
                Select calibration points
            </h2>
            <div className="w-100 d-flex justify-content-center">
                <div className="mb-3 w-75">
                    <div className="d-flex mb-2">
                        <div className="w-50 d-flex me-2">
                            <label className="me-2 ">1:</label>
                            <input disabled name="myInput" value={getSelectedPointCoorString(selectedPoints[0])} />
                        </div>

                        <div className="w-50 d-flex">
                            <label className="me-2 ">2:</label>
                            <input disabled name="myInput" value={getSelectedPointCoorString(selectedPoints[2])} />
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="w-50 d-flex me-2">
                            <label className="me-2 ">3:</label>
                            <input disabled name="myInput" value={getSelectedPointCoorString(selectedPoints[1])} />
                        </div>
                        <div className="w-50 d-flex">
                            <label className="me-2 ">4:</label>
                            <input disabled name="myInput" value={getSelectedPointCoorString(selectedPoints[3])} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <div className="me-1"><UiButton onClick={calibrateData}>Confirm points</UiButton></div>
                <div><UiButton onClick={resetToStart}>Reset</UiButton></div>
            </div>

            <div className="divider"></div>
            <UiButton onClick={calcDistance}>Check Distance</UiButton>
            <div>{returnValue}</div>
        </div>
    )
}