import { Component, Input, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'info-icon',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './info-icon.component.html',
    styleUrls: ['./info-icon.component.scss']
})
export class InfoIconComponent {
    @Input() description: string;
}
