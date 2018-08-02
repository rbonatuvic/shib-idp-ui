import { Component, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';
import { map, distinctUntilChanged, skipWhile } from 'rxjs/operators';
import { SelectProviderRequest } from '../action/collection.action';
import * as fromProviders from '../reducer';
import { MetadataProvider } from '../../domain/model';
import { SetDefinition } from '../../../wizard/action/wizard.action';
import { MetadataProviderEditorTypes } from '../model';

@Component({
    selector: 'provider-select',
    templateUrl: './provider-select.component.html',
    styleUrls: []
})

export class ProviderSelectComponent implements OnDestroy {
    actionsSubscription: Subscription;

    provider$: Observable<MetadataProvider>;

    constructor(
        private store: Store<fromProviders.State>,
        private route: ActivatedRoute
    ) {
        this.actionsSubscription = this.route.params.pipe(
            distinctUntilChanged(),
            map(params => new SelectProviderRequest(params.providerId))
        ).subscribe(store);

        this.provider$ = this.store.select(fromProviders.getSelectedProvider).pipe(skipWhile(p => !p));

        this.provider$
            .subscribe(provider => {
                this.store.dispatch(new SetDefinition({
                    ...MetadataProviderEditorTypes.find(def => def.type === provider['@type'])
                }));
            });
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
}

