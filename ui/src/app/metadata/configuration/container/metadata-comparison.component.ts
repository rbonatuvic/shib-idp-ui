import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil, filter } from 'rxjs/operators';
import { ConfigurationState, getVersionConfigurations, getVersionConfigurationCount, getConfigurationModel, getVersionsFilters } from '../reducer';
import { Metadata } from '../../domain/domain.type';
import { CompareVersionRequest } from '../action/compare.action';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { getAdditionalFilters } from '../../filter/reducer';
import { LoadFilterRequest } from '../../filter/action/collection.action';

@Component({
    selector: 'metadata-comparison',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-comparison.component.html',
    styleUrls: []
})
export class MetadataComparisonComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    versions$: Observable<MetadataConfiguration>;
    numVersions$: Observable<number>;
    filters$: Observable<unknown[]>;
    model$: Observable<Metadata>;

    id: string;
    kind: string;

    constructor(
        private store: Store<ConfigurationState>,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.pipe(
            map(params => params.versions),
            map(versions => new CompareVersionRequest(versions))
        ).subscribe(this.store);

        this.versions$ = this.store.select(getVersionConfigurations);
        this.numVersions$ = this.store.select(getVersionConfigurationCount);
        this.model$ = this.store.select(getConfigurationModel);

        this.model$
            .pipe(
                takeUntil(this.ngUnsubscribe),
                filter(model => !!model)
            )
            .subscribe(p => this.setModel(p));

        this.filters$ = this.store.select(getVersionsFilters);
    }

    setModel(data: Metadata): void {
        this.id = 'resourceId' in data ? data.resourceId : data.id;
        this.kind = '@type' in data ? 'provider' : 'resolver';
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
