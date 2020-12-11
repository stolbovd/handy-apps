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
define(["require", "exports", "kontext/sd/appmodel", "knockout", "jasmineMatchers"], function (require, exports, appmodel_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runSpec = exports.AppModelSpec = exports.Spec = exports.expectArrayEqual = exports.expectArraySize = void 0;
    function expectArraySize(array, length) {
        expect(array).not.toBeNull();
        expect(Array.isArray(array)).toBeTruthy();
        expect(array.length).toEqual(length);
    }
    exports.expectArraySize = expectArraySize;
    function expectArrayEqual(array, expected) {
        expectArraySize(array, expected.length);
        for (var index in expected)
            expect(array[index]).toBe(expected[index]);
    }
    exports.expectArrayEqual = expectArrayEqual;
    var Spec = /** @class */ (function (_super) {
        __extends(Spec, _super);
        function Spec(app) {
            var _this = _super.call(this, app) || this;
            _this.app.onbeforeunload(false);
            _this.app.deferreds.add("spec");
            return _this;
        }
        Spec.prototype.init = function (done) {
            var postConnect = app.postConnect;
            app.postConnect = function () {
                postConnect.bind(app);
                expect(knockout_1.isObservable(app.ladda)).toBeTruthy();
                done();
            };
            app.deferreds.resolve();
        };
        return Spec;
    }(appmodel_1.AppDecorator));
    exports.Spec = Spec;
    var AppModelSpec = /** @class */ (function (_super) {
        __extends(AppModelSpec, _super);
        function AppModelSpec() {
            var _this = _super.call(this) || this;
            _this.spec = new Spec(_this);
            return _this;
        }
        return AppModelSpec;
    }(appmodel_1.AppModel));
    exports.AppModelSpec = AppModelSpec;
    function runSpec() {
        if (window)
            window.onload();
    }
    exports.runSpec = runSpec;
});
