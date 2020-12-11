export declare class TableToExcel {
    uri: string;
    template: string;
    tableId: string;
    name: string;
    base64(s: string): string;
    format(s: string, c: any): string;
    callByName: (tableId: string, name: string) => void;
    callByTable: (table: HTMLTableElement, name: string) => void;
    call: () => void;
    constructor(tableId: string, name: string);
}
