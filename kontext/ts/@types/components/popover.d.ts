/// <reference types="bootstrap-datepicker" />
/// <reference types="icheck" />
/// <reference types="bootstrap-colorpicker" />
/// <reference types="jquery-slimscroll" />
/// <reference types="bootstrap" />
import "jquery";
import { Map } from "kontext/sd/types";
export interface IPopoverPinned {
    popoverPinned: PopoverPinned;
    popover(): any;
}
export declare class PopoverPinned {
    $element: JQuery;
    isHover: boolean;
    enterShow(): void;
    exitHide(): void;
    clickToggle(): void;
    bindHover(): void;
    constructor($element: JQuery, options: Map<any>);
}
export declare function popover(title: string, template: string, placement?: string): any;
