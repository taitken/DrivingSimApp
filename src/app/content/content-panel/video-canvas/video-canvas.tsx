import { useRef, useState, useEffect } from "react";
import { xy } from "../../../../models/xy.model";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { StateTrigger } from "../../../../services/state.service";
import { VideoCanvasThumbnail } from "./video-canvas-thumbnail/video-canvas-thumbnail";
import './video-canvas.css'


export function VideoCanvas({ rowCols }: { rowCols: xy }) {
    const calibrationCanvas = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropZone = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);
    const [dragOver, setdragOver] = useState(false);
    const [videoSelected, setVideoSelected] = useState(false);
    const [thumbnails, setThumbnails] = useState([]);
    const scaleFactor: number = 5;
    let frameWidth: number;
    let frameHeight: number;
    let selectedFile;
    let selectedVideo: xy;
    let selectedPoints: xy[] = [];

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

        ServiceProvider.stateService.subscribeToStateTrigger(StateTrigger.VIDEO_SECTION_SELECTED, (newVideoSectionXY => {
            selectVideoSection(newVideoSectionXY)
        }));
    });


    useEffect(() => {
        console.log("here")
        onSeekedVideo();
    }, [rowCols])

    function handleDragOverEvent(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
        setdragOver(true);
    }

    function handleDragEnd(ev) {
        console.log("leave")
        ev.preventDefault();
        setdragOver(false);
    }

    function handleDrop(ev) {
        ev.preventDefault();
        if (ev.dataTransfer.files.length) {
            onVideoDrop(ev.dataTransfer.files)
        }
    }

    function handleClick() {
        inputRef.current.click();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onVideoDrop(e.target.files);
    }

    function onVideoDrop(fileList: FileList) {
        setVideoSelected(true);
        selectedFile = fileList[0];
        if (selectedFile) {
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
            selectVideoSection(new xy(0, 0));

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
        ServiceProvider.stateService.updateState(StateTrigger.CALIBRATION_POINTS, selectedPoints);
        calibrationCanvas.current.getContext('2d').drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    function selectCanvasDot(event) {
        if (selectedVideo &&
            !(selectedVideo.x == 0 && selectedVideo.y == 0)
            && selectedPoints.length < 4) {
            let ctx = calibrationCanvas.current.getContext('2d');
            let rect = calibrationCanvas.current.getBoundingClientRect();
            ctx.fillStyle = "red";
            ctx.fillRect(event.clientX - rect.left - 2, event.clientY - rect.top - 2, 5, 5)
            selectedPoints.push(new xy(event.clientX - rect.left, event.clientY - rect.top))


            if (selectedPoints.length == 4) {
                selectedPoints.sort((a, b) => {
                    if (a.y == b.y) return a.x - b.x;
                    return a.y - b.y;
                });
                let orderedPoints = [selectedPoints[0], selectedPoints[1]].sort((a, b) => {
                    if (a.x == b.x) return a.y - b.y;
                    return a.x - b.x;
                }).concat([selectedPoints[2], selectedPoints[3]].sort((a, b) => {
                    if (a.x == b.x) return b.y - a.y;
                    return b.x - a.x;
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
                ServiceProvider.stateService.updateState(StateTrigger.CALIBRATION_POINTS, selectedPoints);
            }

        }
    }



    function selectVideoSection(xy: xy) {
        selectedVideo = xy;
        if (xy.x == 0 && xy.y == 0) {
            drawVideoOnCanvas(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight, 0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
            drawGridLines();
        } else {
        }
        drawVideoOnCanvas(videoRef.current, frameWidth * (xy.x - 1), frameHeight * (xy.y - 1), frameWidth, frameHeight, 0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
    }

    function generateThumbnails() {
        const newThumbnails = [
            <div className="m-2" key={"00"}>
                <VideoCanvasThumbnail
                    image={videoRef.current}
                    xy={{ x: 0, y: 0 }}
                    width={videoRef.current.clientWidth / scaleFactor}
                    height={videoRef.current.clientHeight / scaleFactor}
                    sx={0}
                    sy={0}
                    sw={videoRef.current.videoWidth}
                    sh={videoRef.current.videoHeight}></VideoCanvasThumbnail>
            </div>
        ];


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
                <div className={videoSelected ? "hidden" : "drop-zone-container"}>
                    <div ref={dropZone} className={"drop-zone ".concat(dragOver ? "drop-zone-drag-over " : "")}
                        id="calibrationDropZone"
                        onDrop={handleDrop}
                        onDragOver={handleDragOverEvent}
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
            <div className="d-flex w-100 overflow-auto" ref={thumbnailContainerRef}>
                {thumbnails}
            </div>
        </>

    )
}