import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { SelectProviderRequest } from '../action/collection.action';
import * as fromProviders from '../reducer';

@Component({
    selector: 'provider-select',
    templateUrl: './provider-select.component.html',
    styleUrls: []
})

export class ProviderSelectComponent implements OnDestroy {
    actionsSubscription: Subscription;

    constructor(
        store: Store<fromProviders.State>,
        route: ActivatedRoute
    ) {
        this.actionsSubscription = route.params.pipe(
            distinctUntilChanged(),
            map(params => new SelectProviderRequest(params.providerId))
        ).subscribe(store);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
}

