import { Component, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';
import * as fromConfiguration from '../reducer';
import { SelectVersionRequest } from '../action/version.action';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
    selector: 'version-page',
    templateUrl: './version.component.html',
    styleUrls: []
})

export class VersionComponent implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    actionsSubscription: Subscription;

    constructor(
        private store: Store<fromConfiguration.State>,
        private route: ActivatedRoute,
    ) {
        this.route
            .params
            .pipe(
                withLatestFrom(
                    this.store.select(fromConfiguration.getConfigurationModelKind),
                    this.store.select(fromConfiguration.getConfigurationModelId)
                ),
                map(([ params, kind, id ]) => ({ version: params.version, id, type: kind })),
                map(request => new SelectVersionRequest(request))
            )
            .subscribe(this.store);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}

