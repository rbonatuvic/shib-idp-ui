import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { SelectResolver } from '../action/collection.action';
import * as fromProviders from '../reducer';

@Component({
    selector: 'resolver-page',
    templateUrl: './resolver.component.html',
    styleUrls: ['./resolver.component.scss'],
    providers: [NgbPopoverConfig]
})
export class ResolverComponent implements OnDestroy {
    actionsSubscription: Subscription;

    constructor(
        store: Store<fromProviders.State>,
        route: ActivatedRoute
    ) {
        this.actionsSubscription = route.params.pipe(
            distinctUntilChanged(),
            map(params => new SelectResolver(params.id))
        ).subscribe(store);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
} /* istanbul ignore next */
