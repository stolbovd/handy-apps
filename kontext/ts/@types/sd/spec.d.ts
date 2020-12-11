import "jasmineMatchers";
import { AppDecorator, AppModel } from "kontext/sd/appmodel";
export declare type IDone = () => void;
export declare function expectArraySize(array: any[], length: number): void;
export declare function expectArrayEqual(array: any[], expected: any[]): void;
export declare class Spec<TApp extends AppModel> extends AppDecorator<TApp> {
    constructor(app: TApp);
    init(done: IDone): void;
}
export declare class AppModelSpec extends AppModel {
    spec: Spec<AppModel>;
    constructor();
}
export declare function runSpec(): void;
