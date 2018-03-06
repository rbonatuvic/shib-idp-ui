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

import { MetadataProvider } from '../model/metadata-provider';
import { EntityDescriptor } from '../model/entity-descriptor';
import { AddDraftRequest } from '../action/draft.action';
import { AddProviderRequest, UploadProviderRequest } from '../action/provider.action';
import * as fromProviders from '../reducer';
import { EntityValidators } from '../service/entity-validators.service';

@Component({
    selector: 'blank-provider-form',
    templateUrl: './blank-provider.component.html'
})
export class BlankProviderComponent implements OnInit {
    @Output() save: EventEmitter<any> = new EventEmitter();

    providerForm: FormGroup;
    ids$: Observable<string[]>;

    constructor(
        private store: Store<fromProviders.ProviderState>,
        private fb: FormBuilder
    ) {
        this.ids$ = this.store.select(fromProviders.getAllEntityIds);
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
