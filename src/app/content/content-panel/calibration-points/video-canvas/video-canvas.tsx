import { useRef, useState, useEffect } from "react";
import { ServiceProvider } from "../../../../../services/service-provider.service";
import { StateTrigger } from "../../../../../services/state.service";
import { VideoCanvasThumbnail } from "./video-canvas-thumbnail/video-canvas-thumbnail";
import './video-canvas.css'
import { XY } from "../../../../../models/xy.model";


export function VideoCanvas({ rowCols }: { rowCols: XY }) {
    const calibrationCanvas = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);
    const [thumbnails, setThumbnails] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null)
    const scaleFactor: number = 5;
    let frameWidth: number;
    let frameHeight: number;
    let selectedPoints: XY[] = [];

    window.onresize = function () {
        calibrationCanvas.current.style.width = '100%';
        calibrationCanvas.current.height = calibrationCanvas.current.width * .75;
    }

    useEffect(() => {
        // Horizontal scrolling
        thumbnailContainerRef.current.addEventListener("wheel", (e) => {
            if (e.deltaY > 0) thumbnailContainerRef.current.scrollLeft += 5;
            else thumbnailContainerRef.current.scrollLeft -= 5;
        });

        let sub1 = ServiceProvider.calibrationCreationService.videoFileEmitter.listenForUpdateAndExecuteImmediately((newVideoFile => {
            onVideoDrop(newVideoFile);
        }));
        let sub2 = ServiceProvider.calibrationCreationService.videoSectionEmitter.listenForUpdates((newVideoSectionXY => {
            selectVideoSection(selectedSection == newVideoSectionXY ? new XY(0, 0) : newVideoSectionXY)
        }));
        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        }
    }, []);

    useEffect(() => {
        onSeekedVideo();

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
        if (true) {
            frameWidth = videoRef.current.videoWidth / rowCols.x;
            frameHeight = videoRef.current.videoHeight / rowCols.y;
            selectVideoSection(new XY(0, 0));
            generateThumbnails();
        }
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
    }

    function drawVideoOnCanvas(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
        selectedPoints = [];
        ServiceProvider.calibrationCreationService.calibrationPointsEmitter.update(selectedPoints);
        calibrationCanvas.current.getContext('2d').drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    function selectCanvasDot(event) {
        if (selectedSection &&
            !(selectedSection.x == 0 && selectedSection.y == 0)
            && selectedPoints.length < 4) {
            let ctx = calibrationCanvas.current.getContext('2d');
            let rect = calibrationCanvas.current.getBoundingClientRect();
            ctx.fillStyle = "red";
            ctx.fillRect(event.clientX - rect.left - 2, event.clientY - rect.top - 2, 5, 5)
            selectedPoints.push(new XY(event.clientX - rect.left, event.clientY - rect.top))


            if (selectedPoints.length == 4) {
                selectedPoints.sort((a, b) => {
                    if (a.x == b.x) return a.y - b.y;
                    return a.x - b.x;
                });
                let orderedPoints = [selectedPoints[0], selectedPoints[1]].sort((a, b) => {
                    if (a.y == b.y) return a.x - b.x;
                    return a.y - b.y;
                }).concat([selectedPoints[2], selectedPoints[3]].sort((a, b) => {
                    if (a.y == b.y) return b.x - a.x;
                    return b.y - a.y;
                }));

                ctx.strokeStyle = "yellow";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(orderedPoints[0].x, orderedPoints[0].y);
                ctx.lineTo(orderedPoints[1].x, orderedPoints[1].y);
                ctx.lineTo(orderedPoints[2].x, orderedPoints[2].y);
                ctx.lineTo(orderedPoints[3].x, orderedPoints[3].y);
                ctx.lineTo(orderedPoints[0].x, orderedPoints[0].y);
                ctx.stroke();
                ServiceProvider.calibrationCreationService.calibrationPointsEmitter.update(selectedPoints);
            }
        }
    }

    function selectVideoSection(xy: XY) {
        setSelectedSection(xy);
        if (xy.x == 0 && xy.y == 0) {
            drawVideoOnCanvas(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight, 0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
            drawGridLines();
        } else {
            drawVideoOnCanvas(videoRef.current, frameWidth * (xy.x - 1), frameHeight * (xy.y - 1), frameWidth, frameHeight, 0, 0, videoRef.current?.clientWidth, videoRef.current?.clientHeight);
        }
    }

    function generateThumbnails() {
        const newThumbnails = [];
        for (let x = 1; x <= rowCols.x; x++) {
            for (let y = 1; y <= rowCols.y; y++) {
                newThumbnails.push(
                    <div className="m-2" key={x.toString() + y.toString()}>
                        <VideoCanvasThumbnail
                            image={videoRef.current}
                            xy={{ x: x, y: y }}
                            width={videoRef.current.clientWidth / scaleFactor}
                            height={videoRef.current.clientHeight / scaleFactor}
                            sx={frameWidth * (x - 1)}
                            sy={frameHeight * (y - 1)}
                            sw={frameWidth}
                            sh={frameHeight}></VideoCanvasThumbnail>
                    </div>
                )
            }
        }
        setThumbnails(newThumbnails);
    }

    return (
        <>
            <div className="canvas-container">
                <div className="position-relative">
                    <video ref={videoRef}></video>
                    <canvas className="video-canvas position-absolute" ref={calibrationCanvas}
                        onClick={selectCanvasDot}></canvas>
                </div>
            </div >
            <div className="d-flex w-100 overflow-auto" ref={thumbnailContainerRef}>
                {thumbnails}
            </div>
        </>

    )
}