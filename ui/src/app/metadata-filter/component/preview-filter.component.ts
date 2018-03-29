import { Component, AfterViewInit, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromFilter from '../reducer';
import { QueryEntityIds } from '../action/filter.action';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';

@Component({
    selector: 'preview-filter',
    templateUrl: './preview-filter.component.html'
})
export class PreviewFilterComponent {
    filter$: Observable<MetadataProvider>;
    constructor(
        public activeModal: NgbActiveModal,
        private store: Store<fromFilter.State>
    ) {
        this.filter$ = this.store.select(fromFilter.getFilter);
    }
}
