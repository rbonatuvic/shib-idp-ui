import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import * as fromConfiguration from '../reducer';

import { ClearConfiguration, SetMetadata } from '../action/configuration.action';
import * as fromReducer from '../reducer';

@Component({
    selector: 'configuration-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './configuration.component.html',
    styleUrls: []
})
export class ConfigurationComponent implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    name$: Observable<string>;
    type$: Observable<string>;

    constructor(
        private store: Store<fromConfiguration.ConfigurationState>,
        private routerState: ActivatedRoute
    ) {
        this.routerState.params.pipe(
            takeUntil(this.ngUnsubscribe),
            map(({ id, type, version }) => new SetMetadata({
                id,
                type,
                version
            }))
        ).subscribe(this.store);

        this.name$ = this.store.select(fromReducer.getConfigurationModelName);
        this.type$ = this.store.select(fromReducer.getConfigurationModelType);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.store.dispatch(new ClearConfiguration());
    }
}
