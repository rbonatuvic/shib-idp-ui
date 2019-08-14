import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromConfiguration from '../reducer';
import { CONFIG_DATE_FORMAT } from '../configuration.values';

@Component({
    selector: 'restore-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './restore.component.html',
    styleUrls: []
})
export class RestoreComponent implements OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    DATE_FORMAT = CONFIG_DATE_FORMAT;

    date = new Date();

    constructor(
        private store: Store<fromConfiguration.ConfigurationState>,
        private routerState: ActivatedRoute
    ) {}

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
