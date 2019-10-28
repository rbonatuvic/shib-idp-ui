import { Component, Input, ChangeDetectionStrategy, Renderer } from '@angular/core';
import { NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'info-icon',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './info-icon.component.html',
    styleUrls: ['./info-icon.component.scss']
})
export class InfoIconComponent {
    @Input() description: string;

    id: string = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now().toString();

    // triggers = 'mouseenter:mouseleave focus:blur';
    triggers = 'click';
    container = 'body';
    placement = ['top'];

    constructor(
        private renderer: Renderer
    ) { }
    focus(element): void {
        this.renderer.invokeElementMethod(element.elementRef.nativeElement, 'focus');
    }
}
