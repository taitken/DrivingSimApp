
import './content.css';
import MenuBar from './menu-bar/menu-bar';
import { ContentPanel } from './content-panel/content-panel';
import { UiButton } from '../ui/ui-button/ui-button';
import { ServiceProvider } from '../../services/service-provider.service';
import { StateTrigger } from '../../services/state.service';
import { MenuStep } from '../../models/enums/menu-steps.enum';

export default function Content() {

    function uploadVideo(): void {
        ServiceProvider.stateService.updateState(StateTrigger.MENU_STEP, MenuStep.UPLOAD_VIDEO);
    }

    function filePicker(): void {
        ServiceProvider.stateService.updateState(StateTrigger.MENU_STEP, MenuStep.TABLE);
    }

    function videoProcessesing(): void {
        ServiceProvider.stateService.updateState(StateTrigger.MENU_STEP, MenuStep.VIDEO_PROCESSING);
    }

    function test(): void {
        window["ipcRenderer"].invokeCopyFile()
            .then((result: string[]) => {
                console.log(result);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    return (
        <>
            <div className="layout-container">
                <MenuBar />
                <div>
                    <div className="buttons-cotnainer d-flex">
                        <UiButton onClick={uploadVideo}>
                            Calibration Creation
                        </UiButton>
                        <UiButton onClick={filePicker}>
                            Calibration Testing
                        </UiButton>
                        <UiButton onClick={videoProcessesing}>
                            Video Processing
                        </UiButton>
                        <UiButton onClick={test}>
                            test
                        </UiButton>
                    </div>
                    <ContentPanel />
                </div>
            </div>
        </>
    )
}   