import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';

import * as fromConfiguration from '../reducer';
import { CONFIG_DATE_FORMAT } from '../configuration.values';
import { RestoreVersionRequest, SelectVersionRestoreRequest } from '../action/restore.action';
import { withLatestFrom, map, takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'restore-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './restore.component.html',
    styleUrls: []
})
export class RestoreComponent implements OnDestroy {

    readonly subj = new Subject<any>();
    restore$ = this.subj.asObservable();

    date$: Observable<string>;
    kind$: Observable<string> = this.store.select(fromConfiguration.getConfigurationModelKind);
    id$: Observable<string> = this.store.select(fromConfiguration.getConfigurationModelId);

    constructor(
        private store: Store<fromConfiguration.ConfigurationState>,
        private datePipe: DatePipe,
        private route: ActivatedRoute
    ) {
        this.restore$.pipe(
            withLatestFrom(
                this.store.select(fromConfiguration.getSelectedVersionId),
                this.kind$,
                this.id$
            ),
            map(([restore, version, type, id]) => new RestoreVersionRequest({ id, type, version }))
        ).subscribe(this.store);

        this.date$ = this.store
            .select(fromConfiguration.getConfigurationVersionDate)
            .pipe(
                map((date) => this.datePipe.transform(date, CONFIG_DATE_FORMAT))
            );

        this.route.queryParams.pipe(
            takeUntil(this.subj),
            map(params => params.version),
            withLatestFrom(this.id$, this.kind$),
            map(([version, id, type]) => new SelectVersionRestoreRequest({ version, id, type }))
        ).subscribe(this.store);
    }

    restore() {
        this.subj.next();
    }

    ngOnDestroy(): void {
        this.subj.complete();
    }
}
