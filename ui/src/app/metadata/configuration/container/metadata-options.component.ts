import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
    ConfigurationState,
    getConfigurationSections,
    getSelectedVersion,
    getSelectedVersionNumber,
    getSelectedIsCurrent,
    getConfigurationModelEnabled,
    getConfigurationHasXml,
    getConfigurationModel
} from '../reducer';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { MetadataVersion } from '../model/version';
import { MetadataFilter } from '../../domain/model';
import { getAdditionalFilters } from '../../filter/reducer';
import { ClearFilters, LoadFilterRequest } from '../../filter/action/collection.action';
import { takeUntil, map } from 'rxjs/operators';
import { Metadata } from '../../domain/domain.type';

@Component({
    selector: 'metadata-options-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-options.component.html',
    styleUrls: []
})
export class MetadataOptionsComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    configuration$: Observable<MetadataConfiguration>;
    isEnabled$: Observable<boolean>;
    version$: Observable<MetadataVersion>;
    versionNumber$: Observable<number>;
    isCurrent$: Observable<boolean>;
    hasXml$: Observable<boolean>;
    filters$: Observable<unknown[]>;
    model$: Observable<Metadata>;

    constructor(
        private store: Store<ConfigurationState>
    ) {
        this.configuration$ = this.store.select(getConfigurationSections);
        this.model$ = this.store.select(getConfigurationModel);
        this.isEnabled$ = this.store.select(getConfigurationModelEnabled);
        this.version$ = this.store.select(getSelectedVersion);
        this.versionNumber$ = this.store.select(getSelectedVersionNumber);
        this.isCurrent$ = this.store.select(getSelectedIsCurrent);
        this.hasXml$ = this.store.select(getConfigurationHasXml);
        this.filters$ = this.store.select(getAdditionalFilters);

        this.model$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(p => {
                this.store.dispatch(new LoadFilterRequest(p.resourceId));
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        this.store.dispatch(new ClearFilters());
    }
}
