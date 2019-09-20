import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { map, withLatestFrom } from 'rxjs/operators';
import { ConfigurationState, getComparisonConfigurationCount } from '../reducer';
import { CompareVersionRequest, ClearVersions, ViewChanged } from '../action/compare.action';
import { MetadataConfiguration } from '../model/metadata-configuration';
import * as fromReducer from '../reducer';

@Component({
    selector: 'metadata-comparison',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-comparison.component.html',
    styleUrls: []
})
export class MetadataComparisonComponent implements OnDestroy {

    limiter: BehaviorSubject<boolean> = new BehaviorSubject(false);

    versions$: Observable<MetadataConfiguration>;
    numVersions$: Observable<number>;
    type$: Observable<string>;
    loading$: Observable<boolean> = this.store.select(fromReducer.getComparisonLoading);
    limited$: Observable<boolean> = this.store.select(fromReducer.getViewChangedOnly);
    sub: Subscription;

    constructor(
        private store: Store<ConfigurationState>,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.pipe(
            map(params => params.versions),
            map(versions => Array.isArray(versions) ? versions : [versions]),
            map(versions => new CompareVersionRequest(versions))
        ).subscribe(this.store);

        this.versions$ = this.store.select(fromReducer.getLimitedComparisonConfigurations);
        this.numVersions$ = this.store.select(getComparisonConfigurationCount);
        this.type$ = this.store.select(fromReducer.getConfigurationModelType);

        this.versions$.subscribe(console.log);

        this.sub = this.limiter.pipe(
            withLatestFrom(this.limited$),
            map(([compare, limit]) => new ViewChanged(!limit))
        ).subscribe(this.store);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
        this.store.dispatch(new ClearVersions());
    }
}
