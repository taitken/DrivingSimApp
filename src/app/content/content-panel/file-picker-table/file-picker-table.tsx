import { useEffect, useState } from 'react';
import { TableData } from '../../../../models/table-data'
import { UiTable } from '../../../ui/ui-table/ui-table'
import './file-picker-table.css'
import { ServiceProvider } from '../../../../services/service-provider.service';
import { UiButton } from '../../../ui/ui-button/ui-button';

export function FilePickerTable() {
    const [selectedRow, setSelectedRow] = useState(null);

    const tableHeaders = [
        { headerString: "File Name", fieldName: "fileName" },
        { headerString: "Test", fieldName: "test" }
    ];

    const [tableData, setTableData] = useState(new TableData(
        tableHeaders,
        [
            { fileName: "test", test: "yee" },
            { fileName: "sdf", test: "df" },
            { fileName: "sdf", test: "df" },
            { fileName: "sdf", test: "df" },
            { fileName: "test", test: "yee" },
        ]
    ));
    useEffect(() => {
        window["ipcRenderer"].invokeGetFileList("/resources/homography_matrices", ["json"])
            .then((result: string[]) => {
                setTableData(new TableData(tableHeaders, result.map(file => { return { fileName: file, test: "test" } })))
            })
            .catch((e) => {
                console.log(e);
            })
    }, []);

    function selectHomopgrayFile(rowData: any) {
        setSelectedRow(rowData);
    }

    function processVideo() {
        if (selectedRow?.fileName) {
            ServiceProvider.backendService.processVideo(selectedRow.fileName).then((response) => {
                console.log(response)
            });
        }
    }

    return (
        <>
            <UiTable tableData={tableData} selectedRow={selectedRow} onSelect={selectHomopgrayFile}></UiTable>
            <div className='mt-3 w-25'>
                <UiButton style="accent" disabled={!selectedRow} onClick={processVideo}>Confirm</UiButton>
            </div>
        </>
    )
}