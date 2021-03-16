import { Component, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { SelectProviderRequest, ClearProviderSelection } from '../action/collection.action';
import * as fromProviders from '../reducer';
import { MetadataProvider } from '../../domain/model';
import { SetDefinition, ClearWizard } from '../../../wizard/action/wizard.action';
import { MetadataProviderEditorTypes } from '../model';
import { ClearProvider } from '../action/entity.action';
import { ClearEditor } from '../action/editor.action';

@Component({
    selector: 'provider-select',
    templateUrl: './provider-select.component.html',
    styleUrls: []
})

export class ProviderSelectComponent implements OnDestroy {
    actionsSubscription: Subscription;
    providerSubscription: Subscription;

    provider$: Observable<MetadataProvider>;

    constructor(
        private store: Store<fromProviders.State>,
        private route: ActivatedRoute
    ) {
        this.actionsSubscription = this.route.params.pipe(
            map(params => new SelectProviderRequest(params.providerId))
        ).subscribe(store);

        this.provider$ = this.store.select(fromProviders.getSelectedProvider).pipe(filter(p => !!p));

        this.providerSubscription = this.provider$.subscribe(provider => {
            this.setDefinition(provider);
        });
        console.log('hi there')
    }

    setDefinition(provider: MetadataProvider): void {
        if (provider) {
            this.store.dispatch(new SetDefinition({
                ...MetadataProviderEditorTypes.find(def => def.type === provider['@type'])
            }));
        }
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
        this.providerSubscription.unsubscribe();
        this.store.dispatch(new ClearProvider());
        this.store.dispatch(new ClearWizard());
        this.store.dispatch(new ClearEditor());
        this.store.dispatch(new ClearProviderSelection());
    }
}

