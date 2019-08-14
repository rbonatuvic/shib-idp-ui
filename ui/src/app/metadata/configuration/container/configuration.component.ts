import { Component, ChangeDetectionStrategy, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, Scroll, Event } from '@angular/router';
import { takeUntil, map, withLatestFrom, filter, timeout, delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable, Subject, interval, combineLatest } from 'rxjs';

import * as fromConfiguration from '../reducer';

import { ClearConfiguration, SetMetadata } from '../action/configuration.action';
import { LoadHistoryRequest, ClearHistory, SelectVersion } from '../action/history.action';
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

        combineLatest(
            this.routerState.params,
            this.routerState.queryParams
        ).pipe(
            takeUntil(this.ngUnsubscribe),
            map(([{ id, type }, { version }]) => new SetMetadata({
                id,
                type,
                version
            }))
        ).subscribe(store);

        this.routerState.params.pipe(
            takeUntil(this.ngUnsubscribe),
            map(params => new LoadHistoryRequest({ id: params.id, type: params.type }))
        ).subscribe(store);

        this.store.select(fromReducer.getVersionCollection).pipe(
            filter(collection => collection && collection.length > 0),
            takeUntil(this.ngUnsubscribe),
            withLatestFrom(
                this.routerState.queryParams
            ),
            map(([collection, params]) => params.version || collection && collection.length ? collection[0].id : null)
        ).subscribe(version => {
            this.store.dispatch(new SelectVersion(version));
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
