export class HeaderKeyPair{
    constructor(_headerString: string, _fieldName: string) {
        this.fieldName = _fieldName;
        this.headerString = _headerString;
    }
    fieldName: string;
    headerString: string;

}

export class TableData {
    constructor(_headers: HeaderKeyPair[], _rowData: any[]) {
        this.headers = _headers;
        this.rowData = _rowData;
    }

    headers: HeaderKeyPair[];
    rowData: any[];
}