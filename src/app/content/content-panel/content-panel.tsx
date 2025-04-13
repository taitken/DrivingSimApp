import { useEffect, useState } from "react";
import { CalibrationPoints } from "./calibration-points/calibration-points";
import { CalibrationVideo } from "./calibration-video/calibration-video";
import './content-panel.css'
import { MenuStep } from "../../../models/enums/menu-steps.enum";
import { ServiceProvider } from "../../../services/service-provider.service";
import { StateTrigger } from "../../../services/state.service";
import { FilePickerTable } from "./file-picker-table/file-picker-table";
import { VideoProcessing } from "./video-processing/video-processing";

export function ContentPanel() {
    const [currentMenuStep, setMenuStep] = useState(MenuStep.UPLOAD_VIDEO);
    useEffect(() => {
        let sub = ServiceProvider.stateService.subscribeToStateTrigger(StateTrigger.MENU_STEP, (newMenuStep: MenuStep) => {
            setMenuStep(newMenuStep)
        });
        return ()=>{
            sub.unsubscribe();
        }
    });

    return (
        <>
            <div className="content-panel">
                {currentMenuStep == MenuStep.UPLOAD_VIDEO && <CalibrationVideo></CalibrationVideo>}
                {currentMenuStep == MenuStep.SELECT_POINTS && <CalibrationPoints></CalibrationPoints>}
                {currentMenuStep == MenuStep.TABLE && <FilePickerTable></FilePickerTable>}
                {currentMenuStep == MenuStep.VIDEO_PROCESSING && <VideoProcessing></VideoProcessing>}
            </div>
        </>
    )
}