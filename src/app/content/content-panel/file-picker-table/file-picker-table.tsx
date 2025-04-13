import { useEffect, useState } from 'react';
import { TableData } from '../../../../models/table-data'
import { UiTable } from '../../../ui/ui-table/ui-table'
import './file-picker-table.css'

export function FilePickerTable() {
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

    return (
        <>
            <UiTable tableData={tableData}></UiTable>
        </>
    )
}