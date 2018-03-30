import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/observable/fromPromise';

import * as fromFilter from '../reducer';
import { ProviderFormFragmentComponent } from '../../metadata-provider/component/forms/provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SearchDialogComponent } from '../component/search-dialog.component';
import { ViewMoreIds, CancelCreateFilter, QueryEntityIds, CreateFilter, UpdateFilter, SaveFilter } from '../action/filter.action';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { PreviewFilterComponent } from '../component/preview-filter.component';


@Component({
    selector: 'new-filter-page',
    templateUrl: './new-filter.component.html'
})
export class NewFilterComponent implements OnInit, OnChanges, OnDestroy {

    changes$: Observable<MetadataProvider>;
    changes: MetadataProvider;
    filter: MetadataProvider = {
        entityId: '',
        serviceProviderName: '',
        relyingPartyOverrides: {
            signAssertion: false,
            dontSignResponse: false,
            turnOffEncryption: false,
            useSha: false,
            ignoreAuthenticationMethod: false,
            omitNotBefore: false,
            responderId: '',
            nameIdFormats: [],
            authenticationMethods: []
        },
        attributeRelease: []
    };

    constructor(
        private store: Store<fromFilter.State>,
        private valueEmitter: ProviderValueEmitter
    ) {
        this.changes$ = this.store.select(fromFilter.getFilter);
        this.changes$.subscribe(c => this.changes = c);
    }

    ngOnInit(): void {
        this.store.dispatch(new CreateFilter(this.filter));

        this.valueEmitter.changeEmitted$.subscribe((changes) => {
            this.store.dispatch(new UpdateFilter(changes));
        });
    }

    ngOnChanges(): void {}

    ngOnDestroy(): void {}

    save(): void {
        this.store.dispatch(new SaveFilter(this.changes));
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter());
    }

    preview(): void {}
}
