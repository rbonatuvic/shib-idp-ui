import {
    Component,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';

import { AddDraftRequest } from '../../domain/action/draft-collection.action';
import { AddProviderRequest, UploadProviderRequest } from '../../domain/action/provider-collection.action';
import * as fromCollections from '../../domain/reducer';
import { EntityValidators } from '../../domain/service/entity-validators.service';

@Component({
    selector: 'blank-provider-form',
    templateUrl: './blank-provider.component.html'
})
export class BlankProviderComponent implements OnInit {
    @Output() save: EventEmitter<any> = new EventEmitter();

    providerForm: FormGroup;
    ids$: Observable<string[]>;

    constructor(
        private store: Store<fromCollections.CollectionState>,
        private fb: FormBuilder
    ) {
        this.ids$ = this.store.select(fromCollections.getAllEntityIds);
    }

    ngOnInit(): void {
        this.providerForm = this.fb.group({
            serviceProviderName: ['', Validators.required],
            entityId: ['', Validators.required, EntityValidators.createUniqueIdValidator(this.ids$)]
        });
    }

    next(): void {
        this.save.emit({
            entityId: this.providerForm.get('entityId').value,
            serviceProviderName: this.providerForm.get('serviceProviderName').value
        });
    }
} /* istanbul ignore next */
