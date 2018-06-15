import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataEntity, MetadataResolver } from '../../domain/model';
import { MetadataTypes, Metadata } from '../../domain/domain.type';
import * as searchActions from '../action/search.action';
import * as fromDashboard from '../reducer';
import { ToggleEntityDisplay } from '../action/manager.action';
import { DeleteDialogComponent } from '../component/delete-dialog.component';
import { PreviewEntity } from '../../domain/action/entity.action';
import { RemoveDraftRequest } from '../../resolver/action/draft.action';

@Component({
    selector: 'manager-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
    searchQuery$: Observable<string>;
    providers$: Observable<Metadata[]>;
    loading$: Observable<boolean>;

    total$: Observable<number>;
    page = 1;
    limit = 8;
    limited$: Observable<Metadata[]>;

    entitiesOpen$: Observable<{[key: string]: boolean}>;

    filterOptions = ['all', MetadataTypes.FILTER, MetadataTypes.PROVIDER];
    filtering$: Observable<string>;
    filtering = 'all';

    constructor(
        private store: Store<fromDashboard.DashboardState>,
        private router: Router,
        private modalService: NgbModal
    ) {
        this.providers$ = store.select(fromDashboard.getSearchResults);
        this.searchQuery$ = store.select(fromDashboard.getSearchQuery);
        this.loading$ = store.select(fromDashboard.getSearchLoading);
        this.entitiesOpen$ = store.select(fromDashboard.getOpenProviders);
        this.filtering$ = store.select(fromDashboard.getFilterType);
        this.filtering$.subscribe(f => this.filtering = f);

        this.total$ = this.providers$.pipe(map(list => list.length));

        this.limited$ = this.getPagedProviders(this.page, this.providers$);

        // this.providers$.subscribe(p => console.log(p));
    }

    ngOnInit (): void {
        this.search();
        this.changeFilter('all');
    }

    getPagedProviders(page: number, list$: Observable<Metadata[]>): Observable<Metadata[]> {
        return list$.pipe(
            map((providers: Metadata[]) => {
                let maxIndex = (page * this.limit) - 1,
                    minIndex = ((page - 1) * this.limit);
                return providers.filter((provider: Metadata, index: number) =>  (maxIndex >= index && index >= minIndex) );
            })
        );
    }

    changeFilter(type: string): void {
        this.store.dispatch(new searchActions.FilterAction(type));
    }

    changePage(index: number): void {
        this.page = index;
        this.limited$ = this.getPagedProviders(index, this.providers$);
    }

    search(query: string = ''): void {
        this.store.dispatch(new searchActions.SearchAction(query));
        this.page = 1;
    }

    edit(entity: MetadataEntity): void {
        this.router.navigate(['resolver', entity.getId(), entity.getId() ? 'edit' : 'wizard']);
    }

    toggleProvider(entity: MetadataEntity): void {
        this.store.dispatch(new ToggleEntityDisplay(entity.getId()));
    }

    openPreviewDialog(entity: MetadataEntity): void {
        this.store.dispatch(new PreviewEntity(entity));
    }

    deleteProvider(entity: MetadataResolver): void {
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
