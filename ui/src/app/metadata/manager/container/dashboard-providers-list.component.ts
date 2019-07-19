import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';

import { ProviderState, getOrderedProvidersInSearch, getOrderedProviders } from '../../provider/reducer';
import * as fromDashboard from '../reducer';
import { map, startWith } from 'rxjs/operators';
import { ChangeProviderOrderUp, ChangeProviderOrderDown } from '../../provider/action/collection.action';
import { Metadata } from '../../domain/domain.type';
import { MetadataProvider } from '../../domain/model';
import { SearchAction } from '../action/search.action';
import { withLatestFrom } from 'rxjs/operators';

@Component({
    selector: 'dashboard-providers-list',
    templateUrl: './dashboard-providers-list.component.html',
    styleUrls: ['./dashboard-providers-list.component.scss']
})

export class DashboardProvidersListComponent implements OnInit {

    providers$: Observable<MetadataProvider[]>;
    searchQuery$: Observable<string>;
    loading$: Observable<boolean>;

    total$: Observable<number>;
    page = 1;
    limit = 20;
    limited$: Observable<Metadata[]>;

    isSearching$: Observable<boolean>;

    private subj: BehaviorSubject<number> = new BehaviorSubject(this.page);
    readonly page$: Observable<number> = this.subj.asObservable();

    constructor(
        private store: Store<ProviderState>,
        private router: Router
    ) {
        const providers = this.store.select(fromDashboard.getSearchResults) as Observable<unknown>;
        this.providers$ = providers as Observable<MetadataProvider[]>;

        this.searchQuery$ = store.select(fromDashboard.getSearchQuery);
        this.loading$ = store.select(fromDashboard.getSearchLoading);

        this.total$ = this.providers$.pipe(map(list => list.length));

        this.isSearching$ = this.searchQuery$.pipe(map(q => q.length > 0));

        this.limited$ = combineLatest(
            this.providers$,
            this.page$
        ).pipe(
            map(([list, page]) => {
                let maxIndex = (page * this.limit) - 1,
                    minIndex = 0;
                return list.filter((provider: Metadata, index: number) => (maxIndex >= index && index >= minIndex));
            })
        );
    }

    ngOnInit(): void {
        this.search();
    }

    loadMore(index: number): void {
        this.subj.next(index);
        this.page = index;
    }

    search(query: string = ''): void {
        this.store.dispatch(new SearchAction({query, selector: getOrderedProviders}));
    }

    onScroll(event: Event): void {
        this.loadMore(this.page + 1);
    }

    view(id: string, page: string): void {
        this.router.navigate(['metadata', 'provider', id, page]);
    }

    edit(provider: MetadataProvider, event: Event): void {
        event.preventDefault();
        this.view(provider.resourceId, 'edit');
    }

    gotoFilters(provider: MetadataProvider): void {
        this.view(provider.resourceId, 'filters');
    }

    updateOrderUp(provider: MetadataProvider): void {
        this.store.dispatch(new ChangeProviderOrderUp(provider.resourceId));
    }

    updateOrderDown(provider: MetadataProvider): void {
        this.store.dispatch(new ChangeProviderOrderDown(provider.resourceId));
    }
}
