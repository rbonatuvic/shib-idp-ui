import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromConfiguration from '../reducer';
import { CONFIG_DATE_FORMAT } from '../configuration.values';
import { CancelRestore } from '../action/restore.action';
import { map } from 'rxjs/operators';

import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'restore-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './restore.component.html',
    styleUrls: []
})
export class RestoreComponent {

    dateString$ = this.store.select(fromConfiguration.getConfigurationVersionDate);
    loading$ = this.store.select(fromConfiguration.getVersionLoading);
    loaded$ = this.loading$.pipe(map(loading => !loading));
    date$: Observable<string>;

    constructor(
        private store: Store<fromConfiguration.ConfigurationState>,
        private datePipe: DatePipe,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.date$ = this.dateString$.pipe(map((date) => this.datePipe.transform(date, CONFIG_DATE_FORMAT)));
    }

    restore() {
        this.router.navigate(['../', 'edit', 'common'], { relativeTo: this.route });
    }

    cancel() {
        this.store.dispatch(new CancelRestore());
    }
}
