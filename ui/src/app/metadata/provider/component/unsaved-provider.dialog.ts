import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, Action } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import * as fromEditor from '../reducer';

@Component({
    selector: 'unsaved-provider',
    templateUrl: './unsaved-provider.dialog.html'
})
export class UnsavedProviderComponent {
    readonly subject: Subject<boolean> = new Subject<boolean>();

    constructor(
        public activeModal: NgbActiveModal,
        private store: Store<fromEditor.State>
    ) { }

    close(): void {
        this.activeModal.close();
    }

    dismiss(): void {
        this.activeModal.dismiss();
    }
}
