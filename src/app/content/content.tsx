
import './content.css';
import MenuBar from './menu-bar/menu-bar';
import { ContentPanel } from './content-panel/content-panel';
import { UiButton } from '../ui/ui-button/ui-button';
import { ContentDisplayed } from '../../models/enums/content-displayed';
import { useState } from 'react';

export default function Content() {
    const [selectedContent, setSelectedContent] = useState(ContentDisplayed.CALIBRATION_CREATION);
    function setContent(newContent: ContentDisplayed): void {
        setSelectedContent
    }


    return (
        <>
            <div className="layout-container">
                <MenuBar />
                <div>
                    <div className="buttons-cotnainer d-flex">
                        <UiButton onClick={() => setSelectedContent(ContentDisplayed.CALIBRATION_CREATION)}>
                            Calibration Creation
                        </UiButton>
                        <UiButton onClick={() => setSelectedContent(ContentDisplayed.CALIBRATION_TESTING)}>
                            Calibration Testing
                        </UiButton>
                        <UiButton onClick={() => setSelectedContent(ContentDisplayed.VIDEO_PROCESSING)}>
                            Video Processing
                        </UiButton>
                    </div>
                    <ContentPanel contentDisplayed={selectedContent} />
                </div>
            </div>
        </>
    )
}   