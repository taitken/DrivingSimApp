
import './content.css';
import MenuBar from './menu-bar/menu-bar';
import { ContentPanel } from './content-panel/content-panel';

export default function Content() {
    return (
        <>
            <div className="layout-container">
                <MenuBar />
                <ContentPanel />
            </div>
        </>
    )
}   