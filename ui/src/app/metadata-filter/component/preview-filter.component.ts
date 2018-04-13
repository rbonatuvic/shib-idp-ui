import { Component, AfterViewInit, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromFilter from '../reducer';
import { QueryEntityIds } from '../action/search.action';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MetadataFilter } from '../../domain/domain.type';

@Component({
    selector: 'preview-filter',
    templateUrl: './preview-filter.component.html'
})
export class PreviewFilterComponent {
    filter$: Observable<MetadataFilter>;
    constructor(
        public activeModal: NgbActiveModal,
        private store: Store<fromFilter.State>
    ) {
        this.filter$ = this.store.select(fromFilter.getFilter);
    }
}
