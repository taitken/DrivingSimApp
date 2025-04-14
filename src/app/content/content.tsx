
import './content.css';
import MenuBar from './menu-bar/menu-bar';
import { ContentPanel } from './content-panel/content-panel';
import { UiButton } from '../ui/ui-button/ui-button';
import { ContentDisplayed } from '../../models/enums/content-displayed';
import { useState } from 'react';
import { ServiceProvider } from '../../services/service-provider.service';

export default function Content() {
    const [selectedContent, setSelectedContent] = useState(ContentDisplayed.CALIBRATION_CREATION);
    function setContent(newContent: ContentDisplayed): void {
        ServiceProvider.calibrationCreationService.resetEmitters();
        ServiceProvider.calibrationTestingService.resetEmitters();
        ServiceProvider.videoProcessingService.resetEmitters();
        setSelectedContent(newContent);
    }

    return (
        <>
            <div className="layout-container">
                <MenuBar contentDisplayed={selectedContent}/>
                <div>
                    <div className="buttons-cotnainer d-flex">
                        <UiButton onClick={() => setContent(ContentDisplayed.CALIBRATION_CREATION)}>
                            Calibration Creation
                        </UiButton>
                        <UiButton onClick={() => setContent(ContentDisplayed.CALIBRATION_TESTING)}>
                            Calibration Testing
                        </UiButton>
                        <UiButton onClick={() => setContent(ContentDisplayed.VIDEO_PROCESSING)}>
                            Video Processing
                        </UiButton>
                    </div>
                    <ContentPanel contentDisplayed={selectedContent} />
                </div>
            </div>
        </>
    )
}   