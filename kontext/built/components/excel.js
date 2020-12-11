define(["require", "exports", "kontext/sd/sd"], function (require, exports, sd_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TableToExcel = void 0;
    var TableToExcel = /** @class */ (function () {
        function TableToExcel(tableId, name) {
            var _this = this;
            this.uri = "data:application/vnd.ms-excel;base64,";
            this.template = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv=\"content-type\" content=\"text/plain; charset=UTF-8\"/></head><body><table>{table}</table></body></html>";
            this.callByName = function (tableId, name) {
                _this.callByTable(document.getElementById(tableId), name);
            };
            this.callByTable = function (table, name) {
                var link = document.createElement("a");
                link.download = name + ".xls";
                link.target = "_target";
                var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
                link.href = _this.uri + _this.base64(_this.format(_this.template, ctx));
                sd_1.clickElement(link);
            };
            this.call = function () {
                _this.callByName(_this.tableId, _this.name);
            };
            this.tableId = tableId;
            this.name = name;
        }
        TableToExcel.prototype.base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        };
        TableToExcel.prototype.format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; });
        };
        return TableToExcel;
    }());
    exports.TableToExcel = TableToExcel;
});
