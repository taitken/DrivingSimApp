import { DragEventHandler, useRef, useState } from "react";
import './video-canvas.css'

export function VideoCanvas() {

    const calibrationDropZone = document.getElementById('calibrationDropZone');
    const canvasDim: { width: number, height: number } = { width: 640, height: 360 }
    const calibrationCanvas = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropZone = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [dragOver, setdragOver] = useState(false);
    const [videoSelected, setVideoSelected] = useState(false);

    function handleDragOver(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ev.dataTransfer.dropEffect = "copy";
        setdragOver(true);
    }

    function handleDragEnd(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        setdragOver(false);
    }

    function handleDrop(ev) {
        console.log(ev);
        ev.preventDefault();
        ev.stopPropagation();
        inputRef.current.onchange(ev);
    }

    function handleClick() {
        inputRef.current.click();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setVideoSelected(true);
        onVideoDrop(e.target.files);
    }

    function loadedVideoData(ev: Event)
    {
        console.log('Calibration video data loaded; setting currentTime');
        // Set a slight offset to ensure a valid frame is ready
        videoRef.current.currentTime = 0.1;
    }

    function onSeekedVideo(ev: Event)
    {
        console.log('Calibration video seeked; drawing frame');
        let calibrationCtx = calibrationCanvas.current.getContext('2d');
        calibrationCtx.drawImage(videoRef.current, 0, 0, canvasDim.width, canvasDim.height);

        // Update heading states:
        // Mark "Upload calibration video" as completed (green)
        const uploadHeading = document.getElementById('uploadVideoHeading');
        if (uploadHeading) {
            uploadHeading.classList.add('completed');
        }
        // Mark "Select calibration points" as active (green)
        const selectHeading = document.getElementById('selectPointsHeading');
        if (selectHeading) {
            selectHeading.classList.add('active');
        }
    }

    function onVideoDrop(fileList: FileList) {
        const file = fileList[0];
        if (file) {
            console.log('Calibration file selected:', file.name);
            const fileURL = URL.createObjectURL(file);
            const video = videoRef.current;
            video.src = fileURL;
            video.preload = 'auto';
            video.muted = true;
            video.playsInline = true;
            video.load();
            video.onloadeddata = loadedVideoData;
            video.onseeked = onSeekedVideo;
        }
    }

    return (
        <>
            <div className="canvas-container" >
                <div>
                    <video ref={videoRef}
                    ></video>
                </div>
                <div className={videoSelected ? "hidden" : ""}>
                    <canvas id="calibrationCanvas" ref={calibrationCanvas} width="640" height="360"></canvas>
                    <div ref={dropZone} className={"drop-zone ".concat(dragOver ? "drop-zone-drag-over " : "")}
                        id="calibrationDropZone"
                        onDrop={handleDrop}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragEnd}
                        onClick={handleClick}
                    >
                        <span className="drop-zone__prompt">
                            <i className="fa fa-upload"></i>
                            Drop your .mkv here or <strong>Browse files</strong>
                        </span>
                        <input
                            type="file"
                            ref={inputRef}
                            className="drop-zone__input"
                            accept=".mkv,video/*"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div >
        </>

    )
}