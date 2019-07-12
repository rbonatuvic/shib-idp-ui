import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigurationState, getVersionCollection } from '../reducer';
import { MetadataVersion } from '../model/version';
import { CompareVersionRequest } from '../action/compare.action';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'metadata-history',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-history.component.html',
    styleUrls: []
})
export class MetadataHistoryComponent {

    history$: Observable<MetadataVersion[]>;

    constructor(
        private store: Store<ConfigurationState>,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.history$ = this.store.select(getVersionCollection);
    }

    compareVersions(versions: MetadataVersion[]): void {
        this.router.navigate(
            ['../', 'compare'],
            {
                queryParams: { versions: versions.map(v => v.id) },
                relativeTo: this.route
            }
        );
    }
}
