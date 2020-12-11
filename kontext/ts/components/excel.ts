import {clickElement} from "kontext/sd/sd";

declare function unescape(s: string): string;
export class TableToExcel {
	uri: string = "data:application/vnd.ms-excel;base64,";
	template: string = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv=\"content-type\" content=\"text/plain; charset=UTF-8\"/></head><body><table>{table}</table></body></html>";
	tableId: string;
	name: string;
	
	base64 (s: string): string {
		return window.btoa(unescape(encodeURIComponent(s)));
	}
	
	format (s: string, c: any) {
		return s.replace(/{(\w+)}/g, (m, p) => c[p])
	}
	
	callByName = (tableId: string, name: string) => {
		this.callByTable(<HTMLTableElement>document.getElementById(tableId), name);
	};
	
	callByTable = (table: HTMLTableElement, name: string) => {
		let link: HTMLAnchorElement = document.createElement("a");
		link.download = name + ".xls";
		link.target = "_target";
		let ctx = {worksheet: name || "Worksheet", table: table.innerHTML};
		link.href = this.uri + this.base64(this.format(this.template, ctx));
		clickElement(link);
	};
	
	call = () => {
		this.callByName(this.tableId, this.name);
	};
	
	constructor (tableId: string, name: string) {
		this.tableId = tableId;
		this.name = name;
	}
}
