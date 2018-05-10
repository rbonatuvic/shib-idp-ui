import {
    Component,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';

import { startWith, take } from 'rxjs/operators';

import { AddDraftRequest } from '../../domain/action/draft-collection.action';
import { AddProviderRequest, UploadProviderRequest } from '../../domain/action/provider-collection.action';
import * as fromCollections from '../../domain/reducer';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { SearchIds } from '../action/search.action';
import * as fromProvider from '../reducer';
import { Provider } from '../../domain/entity/provider';
import { CreateProviderCopyRequest } from '../action/copy.action';


@Component({
    selector: 'copy-provider-form',
    templateUrl: './copy-provider.component.html'
})
export class CopyProviderComponent implements OnInit {
    @Output() save: EventEmitter<any> = new EventEmitter();

    providerForm: FormGroup;
    ids$: Observable<string[]>;
    searchResults$: Observable<string[]>;

    constructor(
        private store: Store<fromCollections.CollectionState>,
        private fb: FormBuilder
    ) {
        this.ids$ = this.store.select(fromCollections.getAllEntityIds);
        this.searchResults$ = this.store.select(fromProvider.getSearchResults);
    }

    ngOnInit(): void {
        this.providerForm = this.fb.group({
            serviceProviderName: ['', [Validators.required]],
            entityId: ['', Validators.required, EntityValidators.createUniqueIdValidator(this.ids$)],
            target: ['', [Validators.required], [EntityValidators.existsInCollection(this.ids$)]]
        });

        this.store.select(fromProvider.getAttributes)
            .pipe(take(1))
            .subscribe(attrs => this.providerForm.setValue({ ...attrs }));

        this.providerForm
            .get('target')
            .valueChanges
            .subscribe(val => {
                this.store.dispatch(new SearchIds(val));
            });
    }

    next(): void {
        this.store.dispatch(new CreateProviderCopyRequest({
            ...this.providerForm.value
        }));
    }

    updateOptions(query: string): void {}
} /* istanbul ignore next */
