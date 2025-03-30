import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './menu-bar.css';
import { UiButton } from "../../ui/ui-button/ui-button";
import { useEffect, useState } from "react";
import { xy } from "../../../models/xy.model";
import { ServiceProvider } from "../../../services/service-provider.service";
import { StateTrigger } from "../../../services/state.service";



export default function MenuBar() {
    const [selectedPoints, setSelectedPoints] = useState([new xy(0,0), new xy(0,0), new xy(0,0), new xy(0,0)]);

    useEffect(() => {
        ServiceProvider.stateService.subscribeToStateTrigger(StateTrigger.CALIBRATION_POINTS, (newSelectedPoints) =>{
            setSelectedPoints(newSelectedPoints)
    });

    });

    return (
        <div className="left-panel">
            <h1>
                <FontAwesomeIcon className="heading-icon" icon={faCamera} />
                Camera Calibration
            </h1>
            <div className="divider"></div>
            <h2 id="uploadVideoHeading" className="highlighted">
                <span className="heading-circle">1</span>
                Upload calibration video
            </h2>
            <h2 id="selectPointsHeading">
                <span className="heading-circle">2</span>
                Select calibration points
            </h2>
            <div className="w-100 d-flex justify-content-center">
                <div className="mb-3 w-75">
                    <div className="d-flex mb-2">
                        <div className="w-50 d-flex me-2">
                            <label className="me-2 ">1:</label>
                            <input disabled name="myInput" value={selectedPoints[0]?.toString() ?? "0,0"} />
                        </div>

                        <div className="w-50 d-flex">
                            <label className="me-2 ">2:</label>
                            <input disabled name="myInput" value={selectedPoints[1]?.toString() ?? "0,0"} />
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="w-50 d-flex me-2">
                            <label className="me-2 ">3:</label>
                            <input disabled name="myInput" value={selectedPoints[2]?.toString() ?? "0,0"} />
                        </div>
                        <div className="w-50 d-flex">
                            <label className="me-2 ">4:</label>
                            <input disabled name="myInput" value={selectedPoints[3]?.toString() ?? "0,0"} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <div className="me-1"><UiButton>Confirm points</UiButton></div>
                <div><UiButton>Reset</UiButton></div>
            </div>

            <div className="divider"></div>
            <UiButton>Next</UiButton>
        </div>
    )
}