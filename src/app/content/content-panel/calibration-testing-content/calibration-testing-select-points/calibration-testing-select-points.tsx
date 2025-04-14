import { useEffect, useState } from "react";
import { SelectVideoBox } from "../../../../shared-components/select-video-box/select-video-box";


export function CalibrationTestingVideoPick() {

    function onSelectVideo(file: File) {
        
    }

    return (
        <>
            <SelectVideoBox videoSelectFunc={onSelectVideo}></SelectVideoBox>
        </>
    )
}