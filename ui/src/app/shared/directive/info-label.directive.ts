import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

/* tslint:disable:directive-selector */
@Directive({
    selector: '.info-icon',
    providers: [NgbPopover]
})
export class InfoLabelDirective {
    constructor(
        private config: NgbPopover,
        private element: ElementRef
    ) {
        
    }
}
