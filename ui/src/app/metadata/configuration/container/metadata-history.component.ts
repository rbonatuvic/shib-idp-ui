import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    ConfigurationState,
    getVersionCollection,
    getConfigurationModelId,
    getConfigurationModelKind
} from '../reducer';
import { MetadataVersion } from '../model/version';
import { Router, ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { LoadHistoryRequest, ClearHistory } from '../action/history.action';

@Component({
    selector: 'metadata-history',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-history.component.html',
    styleUrls: []
})
export class MetadataHistoryComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    history$: Observable<MetadataVersion[]>;

    constructor(
        private store: Store<ConfigurationState>,
        private router: Router,
        private route: ActivatedRoute
    ) {
        combineLatest(
            this.store.select(getConfigurationModelId),
            this.store.select(getConfigurationModelKind)
        ).pipe(
            takeUntil(this.ngUnsubscribe),
            map(([id, kind]) => ({ id, type: kind })),
            map(request => new LoadHistoryRequest(request))
        ).subscribe(store);

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
            [ '../', 'version', version.id, 'restore' ],
            {
                relativeTo: this.route
            }
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.store.dispatch(new ClearHistory());
    }
}
