import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './menu-bar.css';
import { UiButton } from "../../ui/ui-button/ui-button";



export default function MenuBar() {
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
            <div className="d-flex">
                <div className="me-1"><UiButton>Confirm points</UiButton></div>
                <div><UiButton>Reset</UiButton></div>
            </div>

            <div className="divider"></div>
            <UiButton>Next</UiButton>
        </div>
    )
}