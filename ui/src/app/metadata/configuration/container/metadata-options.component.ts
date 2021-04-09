import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { takeUntil, filter, withLatestFrom } from 'rxjs/operators';

import {
    ConfigurationState,
    getConfigurationSections,
    getSelectedIsCurrent,
    getConfigurationModelEnabled,
    getConfigurationHasXml,
    getConfigurationModel,
    getConfigurationModelType
} from '../reducer';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { MetadataEntity, MetadataFilter, MetadataResolver } from '../../domain/model';
import { getAdditionalFilters } from '../../filter/reducer';
import {
    ClearFilters,
    LoadFilterRequest,
    ChangeFilterOrderDown,
    ChangeFilterOrderUp,
    RemoveFilterRequest
} from '../../filter/action/collection.action';

import { Metadata } from '../../domain/domain.type';
import { DeleteFilterComponent } from '../../provider/component/delete-filter.component';
import { ClearHistory } from '../action/history.action';
import { DeleteDialogComponent } from '../../manager/component/delete-dialog.component';
import { RemoveDraftRequest } from '../../resolver/action/draft.action';
import { RemoveResolverRequest } from '../../resolver/action/collection.action';
import { RemoveMetadataRequest } from '../../../admin/action/metadata-collection.action';

@Component({
    selector: 'metadata-options-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-options.component.html',
    styleUrls: []
})
export class MetadataOptionsComponent implements OnDestroy {

    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    configuration$: Observable<MetadataConfiguration> = this.store.select(getConfigurationSections);
    isEnabled$: Observable<boolean> = this.store.select(getConfigurationModelEnabled);
    isCurrent$: Observable<boolean> = this.store.select(getSelectedIsCurrent);
    hasXml$: Observable<boolean> = this.store.select(getConfigurationHasXml);
    filters$: Observable<unknown[]> = this.store.select(getAdditionalFilters);
    model$: Observable<Metadata> = this.store.select(getConfigurationModel);
    type$: Observable<string> = this.store.select(getConfigurationModelType);
    id: string;
    kind: string;

    constructor(
        protected store: Store<ConfigurationState>,
        protected modalService: NgbModal,
        protected scroller: ViewportScroller,
        protected router: Router,
        protected activatedRoute: ActivatedRoute
    ) {
        this.model$
            .pipe(
                takeUntil(this.ngUnsubscribe),
                filter(model => !!model)
            )
            .subscribe(p => this.setModel(p));

        const sub = this.filters$.pipe(
            withLatestFrom(this.activatedRoute.fragment)
        ).subscribe(([filters, fragment]) => {
            if (filters && fragment) {
                setTimeout(() => {
                    scroller.scrollToAnchor(fragment);
                    sub.unsubscribe();
                }, 100);
            }
        });
    }

    edit(id: string) {
        this.router.navigate(['../', 'edit', id], { relativeTo: this.activatedRoute.parent });
    }

    setModel(data: Metadata): void {
        this.id = 'resourceId' in data ? data.resourceId : data.id;
        this.kind = '@type' in data ? 'provider' : 'resolver';
        if (this.kind === 'provider') {
            this.store.dispatch(new LoadFilterRequest(this.id));
        }
    }

    onScrollTo(element): void {
        this.scroller.scrollToAnchor(element);
    }

    updateOrderUp(filter: MetadataFilter): void {
        this.store.dispatch(new ChangeFilterOrderUp(filter.resourceId));
    }

    updateOrderDown(filter: MetadataFilter): void {
        this.store.dispatch(new ChangeFilterOrderDown(filter.resourceId));
    }

    removeFilter(id: string): void {
        this.modalService
            .open(DeleteFilterComponent)
            .result
            .then(
                success => {
                    this.store.dispatch(new RemoveFilterRequest(id));
                },
                err => {
                    console.log('Cancelled');
                }
            );
    }

    deleteResolver(id: string): void {
        this.modalService
            .open(DeleteDialogComponent)
            .result
            .then(
                success => {
                    this.store.dispatch(new RemoveMetadataRequest(id));
                },
                err => {
                    console.log('Cancelled');
                }
            );
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        this.store.dispatch(new ClearFilters());
        this.store.dispatch(new ClearHistory());
    }
}
