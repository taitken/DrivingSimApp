
import { useRef } from 'react';
import './content.css';
import MenuBar from './menu-bar/menu-bar';
import { ContentPanel } from './content-panel/content-panel';

export default function Content() {
    // ----- Calibration Drop Zone (Step 1) -----
    const calibrationDropZone = document.getElementById('calibrationDropZone');
    const calibrationFileInput = document.getElementById('calibrationFileInput');
    const calibrationCanvas = useRef<HTMLCanvasElement>(null);
    const canvasDim: { width: number, height: number } = { width: 640, height: 360 }



    // // Drag-and-drop events for the calibration drop zone
    // calibrationDropZone.addEventListener('dragover', (e) => {
    //     e.preventDefault();
    //     calibrationDropZone.classList.add('dragover');
    // });
    // calibrationDropZone.addEventListener('dragleave', () => {
    //     calibrationDropZone.classList.remove('dragover');
    // });
    // calibrationDropZone.addEventListener('drop', (e) => {
    //     e.preventDefault();
    //     calibrationDropZone.classList.remove('dragover');
    //     if (e.dataTransfer.files.length) {
    //         calibrationFileInput.files = e.dataTransfer.files;
    //         calibrationFileInput.dispatchEvent(new Event('change'));
    //     }
    // });

    // video.addEventListener('seeked', () => {
    //     console.log('Calibration video seeked; drawing frame');
    //     calibrationCtx.drawImage(video, 0, 0, calibrationCanvas.width, calibrationCanvas.height);
    //     URL.revokeObjectURL(fileURL); // Cleanup the object URL

    //     // Update heading states:
    //     // Mark "Upload calibration video" as completed and remove its highlight
    //     const uploadHeading = document.getElementById('uploadVideoHeading');
    //     if (uploadHeading) {
    //         uploadHeading.classList.remove('highlighted');
    //         uploadHeading.classList.add('completed'); // optional: mark as done
    //     }
    //     // Mark "Select calibration points" as active by adding the highlight
    //     const selectHeading = document.getElementById('selectPointsHeading');
    //     if (selectHeading) {
    //         selectHeading.classList.add('highlighted');
    //         selectHeading.classList.add('active'); // optional: if you want an extra state
    //     }
    // });

    return (
        <>
            <div className="layout-container">
                <div>
                    <MenuBar />
                </div>
                <div >
                    <ContentPanel />
                </div>
            </div>
        </>
    )
}   