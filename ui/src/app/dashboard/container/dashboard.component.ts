import 'rxjs/add/operator/take';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';
import * as searchActions from '../action/search.action';
import * as providerActions from '../../metadata-provider/action/provider.action';
import * as draftActions from '../../metadata-provider/action/draft.action';
import * as fromProviders from '../../metadata-provider/reducer';
import * as fromDashboard from '../reducer';
import { ToggleProviderDisplay, PreviewProvider } from '../action/dashboard.action';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDialogComponent } from '../component/delete-dialog.component';

@Component({
    selector: 'dashboard-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    searchQuery$: Observable<string>;
    providers$: Observable<MetadataProvider[]>;
    loading$: Observable<boolean>;

    total$: Observable<number>;
    page = 1;
    limit = 8;
    limited$: Observable<MetadataProvider[]>;

    providersOpen$: Observable<{[key: string]: boolean}>;

    constructor(
        private store: Store<fromDashboard.DashboardState>,
        private router: Router,
        private modalService: NgbModal
    ) {
        this.providers$ = store.select(fromDashboard.getSearchResults);
        this.searchQuery$ = store.select(fromDashboard.getSearchQuery);
        this.loading$ = store.select(fromDashboard.getSearchLoading);
        this.providersOpen$ = store.select(fromDashboard.getOpenProviders);

        this.total$ = this.providers$.map(list => list.length);

        this.limited$ = this.getPagedProviders(this.page, this.providers$);
    }

    ngOnInit (): void {
        this.search();
    }

    getPagedProviders(page: number, list$: Observable<MetadataProvider[]>): Observable<MetadataProvider[]> {
        return list$.map((providers: MetadataProvider[]) => {
            let maxIndex = (page * this.limit) - 1,
                minIndex = ((page - 1) * this.limit);
            return providers.filter((provider: MetadataProvider, index: number) =>  (maxIndex >= index && index >= minIndex) );
        });
    }

    changePage(index: number): void {
        this.page = index;
        this.limited$ = this.getPagedProviders(index, this.providers$);
    }

    search(query: string = ''): void {
        this.store.dispatch(new searchActions.SearchAction(query));
        this.page = 1;
    }

    edit(provider: MetadataProvider): void {
        let path = provider.id ? 'edit' : 'wizard',
            id = provider.id ? provider.id : provider.entityId;
        this.router.navigate(['provider', id, path]);
    }

    toggleProvider(provider: MetadataProvider): void {
        this.store.dispatch(new ToggleProviderDisplay(provider.entityId));
    }

    openPreviewDialog(provider: MetadataProvider): void {
        this.store.dispatch(new PreviewProvider(provider));
    }

    deleteProvider(provider: MetadataProvider): void {
        this.modalService
            .open(DeleteDialogComponent)
            .result
            .then(
                success => {
                    this.store.dispatch(new draftActions.RemoveDraftRequest(provider));
                },
                err => {
                    console.log('Cancelled');
                }
            );
    }
} /* istanbul ignore next */
