import { SelectVideoBox } from "../../../../shared-components/select-video-box/select-video-box";


export function CalibrationTestingVideoPicker() {

    function onSelectVideo(file: File) {
        
    }

    return (
        <>
            <SelectVideoBox videoSelectFunc={onSelectVideo}></SelectVideoBox>
        </>
    )
}