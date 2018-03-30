import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MetadataProvider } from '../../domain/model/metadata-provider';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
    selector: 'delete-dialog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './delete-dialog.component.html'
})
export class DeleteDialogComponent {
    constructor(
        public activeModal: NgbActiveModal
    ) { }
} /* istanbul ignore next */
