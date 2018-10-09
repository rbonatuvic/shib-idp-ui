import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

/* tslint:disable:directive-selector */
@Directive({
    selector: '.info-icon',
    providers: [NgbPopover]
})
export class InfoLabelDirective {
    @HostListener('keydown.space') onSpaceDown() {
        this.config.open();
    }
    @HostListener('keyup.space') onSpaceUp() {
        this.config.close();
    }
    constructor(
        private config: NgbPopover,
        private element: ElementRef
    ) {
        config.triggers = 'mouseenter:mouseleave';
        config.placement = ['top', 'left'];
        config.container = 'body';
        element.nativeElement.setAttribute('tabindex', 0);
    }
}
