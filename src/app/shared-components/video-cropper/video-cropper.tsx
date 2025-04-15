import { useRef, useState, useEffect, BaseSyntheticEvent } from "react";
import './video-cropper.css'
import { XY } from "../../../models/xy.model";
import { BaseContentService } from "../../../services/base-content.service";

interface UiButtonInterface {
    rowCols: XY,
    eventEmitterService: BaseContentService,
}

export function VideoCropper({ rowCols, eventEmitterService }: UiButtonInterface) {
    const calibrationCanvas = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedSection, setSelectedSection] = useState(null)
    let frameWidth: number;
    let frameHeight: number;
    let selectedPoints: XY[] = [];

    window.onresize = function () {
        calibrationCanvas.current.style.width = '100%';
        calibrationCanvas.current.height = calibrationCanvas.current.width * .75;
    }

    useEffect(() => {
        let sub1 = eventEmitterService.videoFileEmitter.listenForUpdateAndExecuteImmediately((newVideoFile => {
            onVideoDrop(newVideoFile);
        }));
        let sub2 = eventEmitterService.videoSectionEmitter.listenForUpdateAndExecuteImmediately((newSection => {
            setSelectedSection(newSection);

        }));
        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        }
    }, []);

    useEffect(() => {
        copyVideoToCanvas();

    }, [rowCols])

    function onVideoDrop(selectedFile: File) {
        if (selectedFile && videoRef.current) {
            const fileURL = URL.createObjectURL(selectedFile);
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

    function loadedVideoData(ev: Event) {
        videoRef.current.currentTime = 0.1;
        calibrationCanvas.current.height = videoRef.current.clientHeight;
        calibrationCanvas.current.width = videoRef.current.clientWidth;
    }

    function onSeekedVideo() {
        copyVideoToCanvas();
    }

    function drawGridLines() {
        const verticalLines = rowCols.x - 1;
        const horizontalLines = rowCols.y - 1;
        const xWidth = calibrationCanvas.current.width / rowCols.x;
        const yHeight = calibrationCanvas.current.height / rowCols.y;
        let ctx = calibrationCanvas.current.getContext('2d');
        ctx.fillStyle = "yellow";
        for (let x = 1; x <= verticalLines; x++) {
            ctx.fillRect(xWidth * x - 1, 0, 2, calibrationCanvas.current.height)
        }
        for (let y = 1; y <= horizontalLines; y++) {
            ctx.fillRect(0, yHeight * y - 1, calibrationCanvas.current.width, 2)
        }
        if (selectedSection) {
            let rect = calibrationCanvas.current.getBoundingClientRect();
            ctx.fillStyle = ctx.fillStyle = "rgba(145, 211, 255, 0.83)";
            let sectionWidth = rect.width / rowCols.x;
            let sectionHeight = rect.height / rowCols.y;
            ctx.fillRect(selectedSection.x * sectionWidth, selectedSection.y * sectionHeight, sectionWidth, sectionHeight);
        }
    }

    function drawVideoOnCanvas(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
        selectedPoints = [];
        eventEmitterService.selectedCanvasPointsEmitter.update(selectedPoints);
        calibrationCanvas.current.getContext('2d').drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    function copyVideoToCanvas() {
        let ctx = calibrationCanvas.current.getContext('2d');
        let rect = calibrationCanvas.current.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        drawVideoOnCanvas(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight, 0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
        drawGridLines();
    }

    function calculateSection(event, rect, rowCols): XY {
        let sectionWidth = rect.width / rowCols.x;
        let sectionHeight = rect.height / rowCols.y;
        let xMousePos = event.clientX - rect.left;
        let yMousePos = event.clientY - rect.top;
        return new XY(Math.floor(xMousePos / sectionWidth), Math.floor(yMousePos / sectionHeight))
    }

    function mouseOver(event) {
        let ctx = calibrationCanvas.current.getContext('2d');
        let rect = calibrationCanvas.current.getBoundingClientRect();
        let sectionWidth = rect.width / rowCols.x;
        let sectionHeight = rect.height / rowCols.y;
        let sectionChoice = calculateSection(event, rect, rowCols);

        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = ctx.fillStyle = "rgba(230, 245, 255, 0.83)";
        ctx.fillRect(sectionChoice.x * sectionWidth, sectionChoice.y * sectionHeight, sectionWidth, sectionHeight);
        drawGridLines();
    }

    function mouseClick(event) {
        let newSection = calculateSection(event, calibrationCanvas.current.getBoundingClientRect(), rowCols);
        if (selectedSection != null && selectedSection.x == newSection.x && selectedSection.y == newSection.y) {
            eventEmitterService.videoSectionEmitter.update(null)
        }
        else {
            eventEmitterService.videoSectionEmitter.update(newSection)
        }
    }

    return (
        <>
            <div className="canvas-container">
                <div className="position-relative">
                    <video ref={videoRef}></video>
                    <canvas className="video-canvas position-absolute" onMouseMove={mouseOver} onMouseUp={mouseClick} onMouseLeave={copyVideoToCanvas} ref={calibrationCanvas}></canvas>
                </div>
            </div >
        </>

    )
}