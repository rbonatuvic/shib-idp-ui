import { Component, OnChanges, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromFilter from '../reducer';

@Component({
    selector: 'search-dialog',
    templateUrl: './search-dialog.component.html'
})
export class SearchDialogComponent implements OnInit, OnChanges {
    constructor(
        public activeModal: NgbActiveModal,
        private store: Store<fromFilter.State>
    ) {
        // console.log(activeModal);
    }

    ngOnChanges(): void {

    }

    ngOnInit(): void {

    }
} /* istanbul ignore next */
