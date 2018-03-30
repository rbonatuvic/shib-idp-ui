import { Component, Input, OnChanges } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, Action } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import { MetadataProvider } from '../../domain/model/metadata-provider';
import * as fromEditor from '../reducer';
import { UpdateDraftRequest } from '../../metadata-provider/action/draft.action';
import { EntityDescriptorService } from '../../metadata-provider/service/entity-descriptor.service';
import { SaveChanges, CancelChanges } from '../action/editor.action';

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
