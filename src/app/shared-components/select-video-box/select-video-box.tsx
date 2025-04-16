import { useEffect, useRef, useState } from "react";
import './select-video-box.css'
import { BaseContentService } from "../../../services/base-content.service";

export function SelectVideoBox({ videoSelectFunc, eventEmitterService }: { videoSelectFunc: (videoFile: File) => void , eventEmitterService: BaseContentService}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const dropZone = useRef<HTMLDivElement>(null);
    const [dragOver, setdragOver] = useState(false);

    function handleDragOverEvent(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
        setdragOver(true);
    }

    function handleDragEnd(ev) {
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
        eventEmitterService.selectFile(inputRef.current, (file: File)=>{
            videoSelectFunc(file);
        });
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e);
        onVideoDrop(e.target.files);
    }

    function onVideoDrop(fileList: FileList) {
        videoSelectFunc(fileList[0]);
    }

    return (
        <>
            <div className={"drop-zone-container"}>
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
        </>
    )
}