import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromContention from '../reducer';
import { ResolveContentionAction } from '../action/contention.action';
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
