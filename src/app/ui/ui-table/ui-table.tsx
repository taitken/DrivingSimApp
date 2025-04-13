import { useEffect } from 'react';
import { HeaderKeyPair, TableData } from '../../../models/table-data'
import './ui-table.css'

export function UiTable({ tableData, selectedRow, onSelect }: { tableData: TableData, selectedRow?: any, onSelect?: (rowData: any) => void }) {

    function onClickRow(rowData: any) {
        if (onSelect) {
            onSelect(rowData);
        }
    }

    function generateHeaders(headers: HeaderKeyPair[]) {
        const returnElements = [];
        for (let i = 0; i < headers.length; i++) {
            returnElements.push(<th key={'th-' + i.toString()}>{headers[i].headerString}</th>);
        }
        return returnElements;
    }

    function generateRows(rowData: any[], headers: HeaderKeyPair[]) {
        const returnElements = [];
        for (let i = 0; i < rowData.length; i++) {
            let rowElements = [];
            for (let ii = 0; ii < headers.length; ii++) {
                if (selectedRow == rowData[i]) {
                    rowElements.push(<td className="selected-row" key={'td-' + i.toString() + '-' + ii.toString()}>{rowData[i][headers[ii].fieldName]}</td>);
                } else {
                    rowElements.push(<td key={'td-' + i.toString() + '-' + ii.toString()}>{rowData[i][headers[ii].fieldName]}</td>);
                }
            }
            returnElements.push(<tr onClick={() => { onClickRow(rowData[i]) }} key={'tr-' + i.toString()}>{rowElements}</tr>)
        }
        return returnElements;
    }

    return (
        <>
            <table className="default-table-style">
                <thead>
                    <tr>
                        {generateHeaders(tableData.headers)}
                    </tr>
                </thead>
                <tbody>
                    {generateRows(tableData.rowData, tableData.headers)}
                </tbody>
                <tfoot>

                </tfoot>
            </table>
        </>
    )
}