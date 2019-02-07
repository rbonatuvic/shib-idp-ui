import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'delete-user-dialog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './delete-user-dialog.component.html'
})
export class DeleteUserDialogComponent {
    constructor(
        public activeModal: NgbActiveModal
    ) { }
} /* istanbul ignore next */
