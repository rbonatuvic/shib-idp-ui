import { Component, ChangeDetectionStrategy, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, Scroll, Event } from '@angular/router';
import { takeUntil, map, withLatestFrom, filter, timeout, delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable, Subject, interval } from 'rxjs';

import * as fromConfiguration from '../reducer';

import { ClearConfiguration, SetMetadata } from '../action/configuration.action';
import { LoadHistoryRequest, ClearHistory, SelectVersion } from '../action/history.action';
import * as fromReducer from '../reducer';
import { ViewportScroller } from '@angular/common';

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
            map(params => new SetMetadata({id: params.id, type: params.type}))
        ).subscribe(store);

        this.routerState.params.pipe(
            takeUntil(this.ngUnsubscribe),
            map(params => new LoadHistoryRequest({ id: params.id, type: params.type }))
        ).subscribe(store);

        this.store.select(fromReducer.getVersionCollection).pipe(
            takeUntil(this.ngUnsubscribe),
            withLatestFrom(
                this.routerState.queryParams
            ),
            map(([collection, params]) => {
                if (collection && collection.length) {
                    return params.version || collection[0].id;
                }
                return null;
            })
        ).subscribe(version => {
            if (version) {
                this.store.dispatch(new SelectVersion(version));
            }
        });

        this.name$ = this.store.select(fromReducer.getConfigurationModelName);
        this.type$ = this.store.select(fromReducer.getConfigurationModelType);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.store.dispatch(new ClearConfiguration());
        this.store.dispatch(new ClearHistory());
    }
}