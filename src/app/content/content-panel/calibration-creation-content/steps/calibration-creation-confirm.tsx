import { ServiceProvider } from "../../../../../services/service-provider.service";
import { UiButton } from "../../../../ui/ui-button/ui-button";
import { UiTable } from "../../../../ui/ui-table/ui-table";
import { ColumnMetaData, TableData } from "../../../../../models/table-data";
import { Dimensions } from "../../../../../models/dimension.model";
import { XY } from "../../../../../models/xy.model";
import { useState } from "react";
import { UiLoading } from "../../../../ui/ui-loading";


export function CalibrationCreationConfirm() {
    const [confirmed, setConfirmed] = useState(false)
    const [results, setResults] = useState(null)
    const eventEmitterService = ServiceProvider.calibrationCreationService;
    const file: File = eventEmitterService.videoFileEmitter.getValue();
    const rwDim: Dimensions = eventEmitterService.realWorldDimensionsEmitter.getValue();
    const selectedPoints: XY[] = eventEmitterService.selectedCanvasPointsEmitter.getValue();

    const tableData: TableData = {
        headers: [
            new ColumnMetaData("Key", "key", "bold"),
            new ColumnMetaData("Value", "value")
        ],
        rowData: [
            { key: "Video File Name", value: file.name },
            { key: "Real world object width", value: rwDim.width },
            { key: "Real world object height", value: rwDim.height },
            { key: "Pixel point #1", value: selectedPoints[0].x.toString() + ", " + selectedPoints[0].y.toString() },
            { key: "Pixel point #2", value: selectedPoints[1].x.toString() + ", " + selectedPoints[1].y.toString() },
            { key: "Pixel point #3", value: selectedPoints[2].x.toString() + ", " + selectedPoints[2].y.toString() },
            { key: "Pixel point #4", value: selectedPoints[3].x.toString() + ", " + selectedPoints[3].y.toString() },
        ]
    }
    function createMatrix() {
        setConfirmed(true);
        ServiceProvider.backendService.calibrate(file, selectedPoints).then(async results => {
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
            <h3 className="text-primary">Create Homography Matrix</h3>
            <p>Please confirm that the details below are correct, and hit the confirm button to produce a homography file. </p>
            <p>This file will be created in the resources/homography_matrices directory, and will be made available to other functions in the app. </p>
            {confirmed == false && <UiTable tableData={tableData}></UiTable>}
            <div className="d-flex mt-auto mb-auto ms-auto me-auto text-primary">
                {confirmed == true && results == null && <UiLoading></UiLoading>}
                {confirmed == true && results != null && resultBox}
            </div>
            <div className="footer ms-auto mt-5 ">
                <UiButton onClick={createMatrix} style="accent" size="lg">Confirm</UiButton>
            </div>
        </>
    )
}