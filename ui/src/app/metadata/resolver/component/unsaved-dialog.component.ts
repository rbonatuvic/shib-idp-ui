import { Component, Input, OnChanges } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, Action } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import * as fromEditor from '../reducer';

@Component({
    selector: 'unsaved-dialog',
    templateUrl: './unsaved-dialog.component.html'
})
export class UnsavedDialogComponent {
    @Input() message;
    @Input() action: Action;

    readonly subject: Subject<boolean> = new Subject<boolean>();

    constructor(
        public activeModal: NgbActiveModal,
        private store: Store<fromEditor.State>
    ) { }

    close(): void {
        this.store.dispatch(this.action);
        this.activeModal.close();
    }

    dismiss(): void {
        this.activeModal.dismiss();
    }
}
