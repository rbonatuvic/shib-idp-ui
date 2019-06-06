import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import * as fromConfiguration from '../reducer';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { takeUntil, map } from 'rxjs/operators';
import { LoadMetadataRequest, ClearConfiguration } from '../action/configuration.action';

@Component({
    selector: 'configuration-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './configuration.component.html',
    styleUrls: []
})
export class ConfigurationComponent implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    configuration$: Observable<MetadataConfiguration>;

    constructor(
        private store: Store<fromConfiguration.ConfigurationState>,
        private routerState: ActivatedRoute
    ) {
        this.configuration$ = this.store.select(fromConfiguration.getConfigurationSections);

        this.routerState.params.pipe(
            takeUntil(this.ngUnsubscribe),
            map(params => new LoadMetadataRequest({id: params.id, type: params.type}))
        ).subscribe(store);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.store.dispatch(new ClearConfiguration());
    }
}
