export class ColumnMetaData{
    constructor(_headerString: string, _fieldName: string, _class: string = "") {
        this.fieldName = _fieldName;
        this.headerString = _headerString;
        this.class = _class;
    }
    fieldName: string;
    headerString: string;
    class: string;

}

export class TableData {
    constructor(_headers: ColumnMetaData[], _rowData: any[]) {
        this.headers = _headers;
        this.rowData = _rowData;
    }

    headers: ColumnMetaData[];
    rowData: any[];
}