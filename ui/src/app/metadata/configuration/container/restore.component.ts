import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromConfiguration from '../reducer';
import { CONFIG_DATE_FORMAT } from '../configuration.values';
import { RestoreVersionRequest } from '../action/restore.action';
import { withLatestFrom, map, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'restore-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './restore.component.html',
    styleUrls: []
})
export class RestoreComponent implements OnDestroy {

    private subj = new Subject<any>();
    restore$ = this.subj.asObservable();

    date$ = this.store.select(fromConfiguration.getConfigurationVersionDate);

    DATE_FORMAT = CONFIG_DATE_FORMAT;

    constructor(
        private store: Store<fromConfiguration.ConfigurationState>
    ) {
        this.restore$.pipe(
            withLatestFrom(
                this.store.select(fromConfiguration.getSelectedVersionId),
                this.store.select(fromConfiguration.getConfigurationModelType),
                this.store.select(fromConfiguration.getConfigurationModelId)
            ),
            map(([restore, version, type, id]) => new RestoreVersionRequest({ id, type, version }))
        ).subscribe(this.store);
    }

    restore() {
        this.subj.next();
    }

    ngOnDestroy(): void {
        this.subj.complete();
    }
}
