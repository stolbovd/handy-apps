import { Observable } from "knockout";
export declare class LStorage {
    key: string;
    isLoaded: Observable<boolean>;
    constructor(key: string);
    setKey(key: string): void;
    addKey(addText: string): void;
    onLoad(data: any): void;
    fillOrLoad(fill: (data: any) => void, load: () => void): void;
    update(data: any): void;
    remove(key?: string): void;
    static occupied(): number;
    static clear(): void;
}
