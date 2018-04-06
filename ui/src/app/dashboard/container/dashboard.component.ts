import 'rxjs/add/operator/take';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { MetadataEntity, MetadataProvider, DomainTypes } from '../../domain/domain.type';
import { Provider } from '../../domain/entity/provider';
import * as searchActions from '../action/search.action';
import * as providerActions from '../../domain/action/provider-collection.action';
import * as draftActions from '../../domain/action/draft-collection.action';
import * as fromDashboard from '../reducer';
import { ToggleEntityDisplay, PreviewEntity } from '../action/dashboard.action';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDialogComponent } from '../component/delete-dialog.component';

@Component({
    selector: 'dashboard-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    searchQuery$: Observable<string>;
    providers$: Observable<MetadataEntity[]>;
    loading$: Observable<boolean>;

    total$: Observable<number>;
    page = 1;
    limit = 8;
    limited$: Observable<MetadataEntity[]>;

    entitiesOpen$: Observable<{[key: string]: boolean}>;

    filterOptions = ['all', 'filter', 'provider'];
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

        this.total$ = this.providers$.map(list => list.length);

        this.limited$ = this.getPagedProviders(this.page, this.providers$);
    }

    ngOnInit (): void {
        this.search();
        this.changeFilter('all');
    }

    getPagedProviders(page: number, list$: Observable<MetadataEntity[]>): Observable<MetadataEntity[]> {
        return list$.map((providers: MetadataEntity[]) => {
            let maxIndex = (page * this.limit) - 1,
                minIndex = ((page - 1) * this.limit);
            return providers.filter((provider: MetadataEntity, index: number) =>  (maxIndex >= index && index >= minIndex) );
        });
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
        if (entity.type === DomainTypes.provider) {
            let path = entity.id ? 'edit' : 'wizard',
                id = entity.id ? entity.id : entity.entityId;
            this.router.navigate(['provider', id, path]);
        }
    }

    toggleProvider(entity: MetadataEntity): void {
        this.store.dispatch(new ToggleEntityDisplay(entity.entityId));
    }

    openPreviewDialog(entity: MetadataEntity): void {
        if (entity.type === DomainTypes.provider) {
            this.store.dispatch(new PreviewEntity(entity));
        }
    }

    deleteProvider(entity: MetadataProvider): void {
        this.modalService
            .open(DeleteDialogComponent)
            .result
            .then(
                success => {
                    this.store.dispatch(new draftActions.RemoveDraftRequest(entity));
                },
                err => {
                    console.log('Cancelled');
                }
            );
    }
} /* istanbul ignore next */
