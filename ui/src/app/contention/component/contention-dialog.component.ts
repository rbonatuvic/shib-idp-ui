import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromContention from '../reducer';
import { Contention, ChangeItem } from '../model/contention';

@Component({
    selector: 'contention-dialog',
    templateUrl: './contention-dialog.component.html',
    styleUrls: ['./contention-dialog.component.scss']
})
export class ContentionDialogComponent {

    contention$: Observable<Contention<any>>;

    theirs: ChangeItem[];
    ours: ChangeItem[];

    resolutionObj: Object;
    rejectionObj: Object;

    constructor(
        public activeModal: NgbActiveModal,
        private store: Store<fromContention.State>
    ) {
        this.contention$ = this.store.select(fromContention.getContention);

        this.contention$.subscribe(contention => {
            if (contention) {
                this.rejectionObj = contention.rejectionObject;
                this.resolutionObj = contention.resolutionObject;

                this.ours = contention.ourChanges;
                this.theirs = contention.theirChanges;
            }
        });
    }
}
