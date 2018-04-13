import { Component, AfterViewInit, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromFilter from '../reducer';
import { QueryEntityIds } from '../action/search.action';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit, AfterViewInit {

    @Input() term: string;
    @Input() source = 'InCommon';

    matches$: Observable<string[]>;
    loading$: Observable<boolean>;

    selected: string;

    limit = 100;
    dbounce = 500;

    form: FormGroup = this.fb.group({
        search: [''],
        entityId: ['']
    });

    constructor(
        public activeModal: NgbActiveModal,
        private store: Store<fromFilter.State>,
        private fb: FormBuilder
    ) {
        this.matches$ = this.store.select(fromFilter.getEntityCollection);
    }

    ngOnInit(): void {
        let search = this.form.get('search');
        search.setValue(this.term);
    }

    ngAfterViewInit(): void {
        const { term, limit } = this;
        this.store.dispatch(new QueryEntityIds({ term, limit }));
    }

    search(term: string = ''): void {
        this.store.dispatch(new QueryEntityIds({ term, limit: this.limit }));
    }
} /* istanbul ignore next */
