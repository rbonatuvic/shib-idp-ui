import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { MetadataEntity } from '../../domain/model';

@Component({
    selector: 'preview-dialog',
    templateUrl: './preview-dialog.component.html'
})
export class PreviewDialogComponent {
    @Input() entity: MetadataEntity;
    @Input() xml: string;

    sub: Subscription;

    constructor(
        public activeModal: NgbActiveModal
    ) {}

    preview(xml): void {
        const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
        FileSaver.saveAs(blob, `${ this.entity.name }.xml`);
    }
}
