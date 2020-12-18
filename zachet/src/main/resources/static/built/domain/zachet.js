var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "kontext/sd/appmodel", "knockout", "kontext/sd/sd"], function (require, exports, appmodel_1, knockout_1, sd_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var emptyTicket = {
        "id": "", "task": ""
    };
    var Ticket = /** @class */ (function () {
        function Ticket() {
            this.code = knockout_1.observable("");
        }
        return Ticket;
    }());
    var ZachetApp = /** @class */ (function (_super) {
        __extends(ZachetApp, _super);
        function ZachetApp() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tickets = knockout_1.observableArray([]);
            return _this;
        }
        ZachetApp.prototype.connect = function () {
            var _this = this;
            var bilet;
            var tickets;
            sd_1.sd.get("tickets.json", function (data) {
                _this.tickets(tickets);
            });
        };
        return ZachetApp;
    }(appmodel_1.AppModel));
    new ZachetApp();
});
