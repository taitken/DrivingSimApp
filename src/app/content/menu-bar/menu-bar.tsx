import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './menu-bar.css';
import { UiButton } from "../../ui/ui-button/ui-button";
import { useEffect, useState } from "react";
import { xy } from "../../../models/xy.model";
import { ServiceProvider } from "../../../services/service-provider.service";
import { StateTrigger } from "../../../services/state.service";
import { MenuStep } from "../../../models/enums/menu-steps.enum";

export default function MenuBar() {
    const [currentMenuStep, sesMenuStep] = useState(MenuStep.UPLOAD_VIDEO);
    const [selectedPoints, setSelectedPoints] = useState([new xy(0, 0), new xy(0, 0), new xy(0, 0), new xy(0, 0)]);

    useEffect(() => {
        ServiceProvider.stateService.subscribeToStateTrigger(StateTrigger.CALIBRATION_POINTS, (newSelectedPoints) => {
            setSelectedPoints(newSelectedPoints)
        });
        ServiceProvider.stateService.subscribeToStateTrigger(StateTrigger.MENU_STEP, (newMenuStep: MenuStep) => {
            sesMenuStep(newMenuStep)
        });
    });

    function getSelectedPointCoorString(points: xy) {
        if (points == null)
            return "0, 0"

        return Math.round(points.x).toString() + ", " + Math.round(points.y).toString()
    }

    function getMenuHightlight(thisMenuStep: MenuStep, selectedMenuStep: MenuStep): string {
        if (thisMenuStep == selectedMenuStep)
            return "menu-heading-selected";
        if (thisMenuStep < selectedMenuStep)
            return "menu-heading-completed"
        return "";
    }

    function hitEndpoint()
    {
        ServiceProvider.backendService.sendAxios([new xy(400,421), new xy(500,433), new xy(400,650), new xy(511,666)]);
        //ServiceProvider.backendService.sendTest();
    }

    function resetToStart() {
        ServiceProvider.stateService.updateState(StateTrigger.MENU_STEP, MenuStep.UPLOAD_VIDEO)
        ServiceProvider.stateService.updateState(StateTrigger.CALIBRATION_POINTS, []);
    }

    return (
        <div className="left-panel">
            <h1>
                <FontAwesomeIcon className="heading-icon" icon={faCamera} />
                Camera Calibration
            </h1>
            <div className="divider"></div>
            <h2 className={getMenuHightlight(MenuStep.UPLOAD_VIDEO, currentMenuStep)}>
                <span className="heading-circle">1</span>
                Upload calibration video
            </h2>
            <h2 className={getMenuHightlight(MenuStep.SELECT_POINTS, currentMenuStep)}>
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
                <div className="me-1"><UiButton onClick={hitEndpoint}>Confirm points</UiButton></div>
                <div><UiButton onClick={resetToStart}>Reset</UiButton></div>
            </div>

            <div className="divider"></div>
            <UiButton>Next</UiButton>
        </div>
    )
}