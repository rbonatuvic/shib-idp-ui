import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataEntity, MetadataResolver } from '../../domain/model';
import * as searchActions from '../action/search.action';
import * as fromDashboard from '../reducer';
import { DeleteDialogComponent } from '../component/delete-dialog.component';
import { RemoveDraftRequest } from '../../resolver/action/draft.action';
import { getAllResolvers } from '../../resolver/reducer';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';

@Component({
    selector: 'dashboard-resolvers-list',
    templateUrl: './dashboard-resolvers-list.component.html'
})

export class DashboardResolversListComponent implements OnInit {
    searchQuery$: Observable<string>;
    resolvers$: Observable<MetadataEntity[]>;
    loading$: Observable<boolean>;

    total$: Observable<number>;
    page = 1;
    limit = 20;
    limited$: Observable<MetadataEntity[]>;

    private subj: BehaviorSubject<number> = new BehaviorSubject(this.page);
    readonly page$: Observable<number> = this.subj.asObservable();

    constructor(
        private store: Store<fromDashboard.DashboardState>,
        private router: Router,
        private modalService: NgbModal
    ) {
        const resolvers: unknown = store.select(fromDashboard.getSearchResults);
        this.resolvers$ = (resolvers as Observable<MetadataResolver[]>)
            .pipe(
                map(list => list.map(resolver => new FileBackedHttpMetadataResolver(resolver as MetadataResolver)))
            );
        this.searchQuery$ = store.select(fromDashboard.getSearchQuery);
        this.loading$ = store.select(fromDashboard.getSearchLoading);

        this.total$ = this.resolvers$.pipe(map(list => list.length));

        this.limited$ = combineLatest(this.resolvers$, this.page$).pipe(
            map(([providers, page]) => {
                let maxIndex = (page * this.limit) - 1,
                    minIndex = 0;
                return providers.filter((resolver: MetadataEntity, index: number) => (maxIndex >= index && index >= minIndex));
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
        this.store.dispatch(new searchActions.SearchAction({query, selector: getAllResolvers}));
        this.page = 1;
    }

    onScroll(event: Event): void {
        this.loadMore(this.page + 1);
    }

    edit(evt: Event, entity: MetadataEntity): void {
        evt.preventDefault();
        this.router.navigate(['metadata', 'resolver', 'new', 'blank', 'common'], {
            queryParams: {
                id: entity.getId()
            }
        });
    }

    viewMetadataHistory(entity: MetadataEntity): void {
        this.router.navigate(['metadata', 'resolver', entity.getId(), 'versions']);
    }

    deleteResolver(entity: MetadataResolver): void {
        this.modalService
            .open(DeleteDialogComponent)
            .result
            .then(
                success => {
                    this.store.dispatch(new RemoveDraftRequest(entity));
                },
                err => {
                    console.log('Cancelled');
                }
            );
    }
}
