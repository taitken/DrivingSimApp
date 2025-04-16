import { useEffect, useState } from "react";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { UiButton } from "../../../ui/ui-button/ui-button";
import { UiLoading } from "../../../ui/ui-loading";
import { TableData, ColumnMetaData } from "../../../../models/table-data";
import { XY } from "../../../../models/xy.model";
import { UiTable } from "../../../ui/ui-table/ui-table";
import { Dimensions } from "../../../../models/dimension.model";


export function VideoProcessingResults() {
    const [confirmed, setConfirmed] = useState(false)
    const [results, setResults] = useState(null)
    const eventEmitterService = ServiceProvider.videoProcessingService;
    const file: File = eventEmitterService.videoFileEmitter.getValue();
    const homographyFileName: string = eventEmitterService.selectedHomographyFile.getValue();
    const selectedPoints: XY[] = eventEmitterService.selectedCanvasPointsEmitter.getValue();
    const videoDim: Dimensions = eventEmitterService.videoDimensions.getValue();
    const cropSections: XY = eventEmitterService.croppedVideoSections.getValue();
    const selectedCrop: XY = eventEmitterService.selectedVideoSectionEmitter.getValue();

    const tableData: TableData = {
        headers: [
            new ColumnMetaData("Key", "key", "bold"),
            new ColumnMetaData("Value", "value")
        ],
        rowData: [
            { key: "Video File Name", value: file.name },
            { key: "Homography File Name", value: homographyFileName },
            { key: "Wheel position", value: selectedPoints[0].x.toString() + "px, " + selectedPoints[0].y.toString() + "px" },
            { key: "Video Resolution", value: videoDim.width.toString() + "x" + videoDim.height.toString() },
        ]
    }
    function processVideo() {
        let topLeftCrop = new XY(videoDim.width / cropSections.x * selectedCrop.x, videoDim.height / cropSections.y * selectedCrop.y);
        let bottomRightCrop = new XY(videoDim.width / cropSections.x * (selectedCrop.x + 1), videoDim.height / cropSections.y * (selectedCrop.y + 1));

        setConfirmed(true);
        ServiceProvider.backendService.processVideo(homographyFileName, file.name, topLeftCrop, bottomRightCrop, selectedPoints[0]).then(async results => {
            await new Promise(f => setTimeout(f, 1000));
            setResults(results.data);
        });
    }

    const resultBox =
        <>
            <div className="bold fs-4">
                {results} created.
            </div>
        </>


    return (
        <>
            <h3 className="text-primary">Process Video</h3>
            <p>The backend analytics process will take a video file, a wheel position and a homography matrix to perform it's calculation. </p>
            <p>The process will analyse each frame in the video to calculate the distance the selected wheel is from the lane line.</p>
            {confirmed == false && <UiTable tableData={tableData}></UiTable>}
            <div className="d-flex mt-auto mb-auto ms-auto me-auto text-primary">
                {confirmed == true && results == null && <UiLoading></UiLoading>}
                {confirmed == true && results != null && resultBox}
            </div>
            <div className="footer ms-auto mt-5 ">
                <UiButton onClick={processVideo} style="accent" size="lg">Confirm</UiButton>
            </div>
        </>
    )
}