import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ConfigurationState, getComparisonConfigurations, getComparisonConfigurationCount } from '../reducer';
import { CompareVersionRequest } from '../action/compare.action';
import { MetadataConfiguration } from '../model/metadata-configuration';
import * as fromReducer from '../reducer';

@Component({
    selector: 'metadata-comparison',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-comparison.component.html',
    styleUrls: []
})
export class MetadataComparisonComponent {

    versions$: Observable<MetadataConfiguration>;
    numVersions$: Observable<number>;
    type$: Observable<string>;

    constructor(
        private store: Store<ConfigurationState>,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.pipe(
            map(params => params.versions),
            map(versions => new CompareVersionRequest(versions))
        ).subscribe(this.store);

        this.versions$ = this.store.select(getComparisonConfigurations);
        this.numVersions$ = this.store.select(getComparisonConfigurationCount);
        this.type$ = this.store.select(fromReducer.getConfigurationModelType);
    }
}
