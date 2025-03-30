import { useEffect, useState } from "react";
import { CalibrationPoints } from "./calibration-points/calibration-points";
import { CalibrationVideo } from "./calibration-video/calibration-video";
import './content-panel.css'
import { MenuStep } from "../../../models/enums/menu-steps.enum";
import { ServiceProvider } from "../../../services/service-provider.service";
import { StateTrigger } from "../../../services/state.service";

export function ContentPanel() {
    const [currentMenuStep, sesMenuStep] = useState(MenuStep.UPLOAD_VIDEO);
    useEffect(() => {
        ServiceProvider.stateService.subscribeToStateTrigger(StateTrigger.MENU_STEP, (newMenuStep: MenuStep) => {
            sesMenuStep(newMenuStep)
        });
    });

    return (
        <>
            <div className="content-panel">
                {currentMenuStep == MenuStep.UPLOAD_VIDEO && <CalibrationVideo></CalibrationVideo>}
                {currentMenuStep == MenuStep.SELECT_POINTS && <CalibrationPoints></CalibrationPoints>}
            </div>
        </>
    )
}