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
    selector: 'dashboard-resolvers-list',
    templateUrl: './dashboard-resolvers-list.component.html'
})

export class DashboardResolversListComponent implements OnInit {
    searchQuery$: Observable<string>;
    resolvers$: Observable<MetadataEntity[]>;
    loading$: Observable<boolean>;

    total$: Observable<number>;
    page = 1;
    limit = 8;
    limited$: Observable<MetadataEntity[]>;

    entitiesOpen$: Observable<{ [key: string]: boolean }>;

    constructor(
        private store: Store<fromDashboard.DashboardState>,
        private router: Router,
        private modalService: NgbModal
    ) {
        this.resolvers$ = store.select(fromDashboard.getSearchResults);
        this.searchQuery$ = store.select(fromDashboard.getSearchQuery);
        this.loading$ = store.select(fromDashboard.getSearchLoading);
        this.entitiesOpen$ = store.select(fromDashboard.getOpenProviders);

        this.total$ = this.resolvers$.pipe(map(list => list.length));

        this.limited$ = this.getPagedResolvers(this.page, this.resolvers$);
    }

    ngOnInit(): void {
        this.search();
    }

    getPagedResolvers(page: number, list$: Observable<MetadataEntity[]>): Observable<MetadataEntity[]> {
        return list$.pipe(
            map((providers: MetadataEntity[]) => {
                let maxIndex = (page * this.limit) - 1,
                    minIndex = ((page - 1) * this.limit);
                return providers.filter((resolver: MetadataEntity, index: number) => (maxIndex >= index && index >= minIndex));
            })
        );
    }

    changePage(index: number): void {
        this.page = index;
        this.limited$ = this.getPagedResolvers(index, this.resolvers$);
    }

    search(query: string = ''): void {
        this.store.dispatch(new searchActions.SearchAction(query));
        this.page = 1;
    }

    edit(entity: MetadataEntity): void {
        if (entity.isDraft()) {
            this.router.navigate(['metadata', 'resolver', 'new', 'blank', 'common'], {
                queryParams: {
                    id: entity.getId()
                }
            });
        } else {
            this.router.navigate(['metadata', 'resolver', entity.getId(), 'edit']);
        }
    }

    toggleEntity(entity: MetadataEntity): void {
        this.store.dispatch(new ToggleEntityDisplay(entity.getId()));
    }

    viewConfiguration(entity: MetadataEntity): void {
        // this.store.dispatch(new PreviewEntity({ id: entity.getId(), entity }));
        this.router.navigate(['metadata', 'resolver', entity.getId(), 'configuration', 'options']);
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
