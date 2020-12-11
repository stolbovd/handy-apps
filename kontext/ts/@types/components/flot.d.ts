/// <reference types="flot" />
import "flotPie";
import { Map, MapNumKey } from "kontext/sd/types";
import plotOptions = jquery.flot.plotOptions;
export interface IGradeData {
    label: string;
    data: number;
    color: string;
}
export declare class FlotPie {
    options: plotOptions;
    gradeData: IGradeData[];
    gradeRange: MapNumKey<number>;
    constructor(options: Map<any>, gradeData: IGradeData[], gradeRange: MapNumKey<number>);
    getDataValueByRange(data: IGradeData[], range: number): number;
    setDataValueByRange(data: IGradeData[], range: number, value: number): void;
    incrementDataValueByRange(data: IGradeData[], range: number, value: number): void;
}
