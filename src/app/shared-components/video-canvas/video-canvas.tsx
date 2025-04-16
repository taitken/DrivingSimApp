import { useRef, useState, useEffect } from "react";
import './video-canvas.css'
import { XY } from "../../../models/xy.model";
import { BaseContentService } from "../../../services/base-content.service";
import { Dimensions } from "../../../models/dimension.model";

interface UiButtonInterface {
    eventEmitterService: BaseContentService,
    numberSelectedPoints: number
}

export function VideoCanvas({ eventEmitterService, numberSelectedPoints }: UiButtonInterface) {
    const calibrationCanvas = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    let selectedPoints: XY[] = [];

    window.onresize = function () {
        calibrationCanvas.current.style.width = '100%';
        calibrationCanvas.current.height = calibrationCanvas.current.width * .75;
    }

    useEffect(() => {
        onSeekedVideo();
        let sub1 = eventEmitterService.videoFileEmitter.listenForUpdateAndExecuteImmediately((newVideoFile => {
            onVideoDrop(newVideoFile);
        }));
        let sub2 = eventEmitterService.selectedVideoSectionEmitter.listenForUpdateAndExecuteImmediately((newVideoSectionXY => {
            selectVideoSection(newVideoSectionXY);
        }));
        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        }
    }, []);

    function onVideoDrop(selectedFile: File) {
        if (selectedFile && videoRef.current) {
            const fileURL = URL.createObjectURL(selectedFile);
            const video = videoRef.current;
            video.src = fileURL;
            video.preload = 'auto';
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
        selectVideoSection(eventEmitterService.selectedVideoSectionEmitter.getValue());
    }

    function drawVideoOnCanvas(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
        selectedPoints = [];
        eventEmitterService.selectedCanvasPointsEmitter.update(selectedPoints);
        calibrationCanvas.current.getContext('2d').drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    function selectCanvasDot(event) {
        if (eventEmitterService.selectedCanvasPointsEmitter.getValue().length < numberSelectedPoints) {
            let ctx = calibrationCanvas.current.getContext('2d');
            let rect = calibrationCanvas.current.getBoundingClientRect();
            ctx.fillStyle = "red";
            ctx.fillRect(event.clientX - rect.left - 2, event.clientY - rect.top - 2, 5, 5)
            selectedPoints.push(new XY(event.clientX - rect.left, event.clientY - rect.top))

            if (selectedPoints.length == numberSelectedPoints) {
                if (numberSelectedPoints > 1) {
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
                    for (let i = 1; i < numberSelectedPoints; i++) {
                        ctx.lineTo(orderedPoints[i].x, orderedPoints[i].y);
                    }
                    ctx.lineTo(orderedPoints[0].x, orderedPoints[0].y);
                    ctx.stroke();
                }
                // Transform to video pixel locations
                let translatedPoints = translateToVideoPixels(
                    selectedPoints,
                    eventEmitterService.selectedVideoSectionEmitter.getValue(),
                    eventEmitterService.croppedVideoSections.getValue(),
                    rect,
                    videoRef.current
                );
                eventEmitterService.videoDimensions.update(new Dimensions(videoRef.current.videoWidth, videoRef.current.videoHeight));
                eventEmitterService.selectedCanvasPointsEmitter.update(translatedPoints);
            }
        }
    }

    function translateToVideoPixels(selectedPoints: XY[], selectedVideoSection: XY, totalVideoSections: XY, rect: DOMRect, videoFile: HTMLVideoElement): XY[] {
        let baseX = selectedVideoSection.x * rect.width;
        let baseY = selectedVideoSection.y * rect.height;

        let widthScaleFactor = videoFile.videoWidth / (rect.width * totalVideoSections.x);
        let heightScaleFactor = videoFile.videoHeight / (rect.height * totalVideoSections.y);
        return selectedPoints.map(point =>
            new XY(
                Math.round(Math.min(Math.max((point.x + baseX) * widthScaleFactor, 0), videoFile.videoWidth)),
                Math.round(Math.min(Math.max((point.y + baseY) * heightScaleFactor), videoFile.videoHeight))));
    }

    function selectVideoSection(xy: XY) {
        if (!xy) {
            drawVideoOnCanvas(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight, 0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
        } else {
            let frameWidth = videoRef.current.videoWidth / eventEmitterService.croppedVideoSections.getValue().x;
            let frameHeight = videoRef.current.videoHeight / eventEmitterService.croppedVideoSections.getValue().y;
            drawVideoOnCanvas(videoRef.current, frameWidth * xy.x, frameHeight * xy.y, frameWidth, frameHeight, 0, 0, videoRef.current?.clientWidth, videoRef.current?.clientHeight);
        }
    }

    return (
        <>
            <div className="video-canvas-container">
                <div className="position-relative">
                    <video ref={videoRef}></video>
                    <canvas className="video-canvas position-absolute" ref={calibrationCanvas}
                        onClick={selectCanvasDot}></canvas>
                </div>
            </div >
        </>

    )
}