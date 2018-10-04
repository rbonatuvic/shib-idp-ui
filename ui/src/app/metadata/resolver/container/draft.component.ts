import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { SelectDraft } from '../action/draft.action';
import * as fromCollection from '../reducer';

@Component({
    selector: 'resolver-page',
    templateUrl: './resolver.component.html',
    styleUrls: ['./resolver.component.scss'],
    providers: [NgbPopoverConfig]
})
export class DraftComponent implements OnDestroy {
    actionsSubscription: Subscription;

    constructor(
        store: Store<fromCollection.State>,
        route: ActivatedRoute
    ) {
        this.actionsSubscription = route.params.pipe(
            distinctUntilChanged(),
            map(params => new SelectDraft(params.entityId))
        ).subscribe(store);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }
} /* istanbul ignore next */
