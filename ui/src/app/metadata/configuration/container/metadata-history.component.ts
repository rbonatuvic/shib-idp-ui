import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigurationState, getVersionCollection } from '../reducer';
import { MetadataVersion } from '../model/version';
import { CompareVersionRequest } from '../action/compare.action';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

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
        this.history$ = this.store.select(getVersionCollection)
            .pipe(map(versions => this.sortVersionsByDate(versions)));
    }

    sortVersionsByDate(versions: MetadataVersion[]): MetadataVersion[] {
        return versions.sort((a, b) => {
            const aDate = new Date(a.date).getTime();
            const bDate = new Date(b.date).getTime();
            return aDate === bDate ? 0 : aDate < bDate ? -1 : 1;
        }).reverse();
    }

    compareVersions(versions: MetadataVersion[]): void {
        const sorted = this.sortVersionsByDate(versions);
        this.router.navigate(
            ['../', 'compare'],
            {
                queryParams: { versions: sorted.map(v => v.id) },
                relativeTo: this.route
            }
        );
    }

    restoreVersion(version: MetadataVersion): void {
        this.router.navigate(
            [ '../', 'restore' ],
            {
                queryParams: { version: version.id },
                relativeTo: this.route
            }
        );
    }
}
