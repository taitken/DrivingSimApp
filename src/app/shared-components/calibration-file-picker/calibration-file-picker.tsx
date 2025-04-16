import { useEffect, useState } from 'react';
import { ColumnMetaData, TableData } from '../../../models/table-data'
import { UiTable } from '../../ui/ui-table/ui-table'
import { ServiceProvider } from '../../../services/service-provider.service';

export function CalibrationFilePicker({onSelectFile} : {onSelectFile: (rowData: any) => void}) {
    const [selectedRow, setSelectedRow] = useState(null);

    const tableHeaders = [
        new ColumnMetaData("File Name",  "fileName"),
    ];
    const [tableData, setTableData] = useState(new TableData(
        tableHeaders,
        []
    ));
    useEffect(() => {
        ServiceProvider.ipcService.getFolderContents("/resources/homography_matrices", ["json"])
            .then((result) => {
                setTableData(new TableData(tableHeaders, result.map(file => { return { fileName: file } })))
            })
    }, []);

    function selectHomopgrayFile(rowData: any) {
        setSelectedRow(rowData);
        onSelectFile(rowData);
    }

    return (
        <>
            <UiTable tableData={tableData} selectedRow={selectedRow} onSelect={selectHomopgrayFile}></UiTable>
        </>
    )
}