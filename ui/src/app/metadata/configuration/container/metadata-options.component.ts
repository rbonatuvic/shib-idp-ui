import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, Event, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { takeUntil, filter, delay } from 'rxjs/operators';

import {
    ConfigurationState,
    getConfigurationSections,
    getSelectedVersion,
    getSelectedVersionNumber,
    getSelectedIsCurrent,
    getConfigurationModelEnabled,
    getConfigurationHasXml,
    getConfigurationModel,
    getConfigurationDefinition
} from '../reducer';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { MetadataVersion } from '../model/version';
import { MetadataFilter } from '../../domain/model';
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
import { Wizard } from '../../../wizard/model';
import { PreviewEntity } from '../../domain/action/entity.action';

@Component({
    selector: 'metadata-options-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-options.component.html',
    styleUrls: []
})
export class MetadataOptionsComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    configuration$: Observable<MetadataConfiguration>;
    isEnabled$: Observable<boolean>;
    version$: Observable<MetadataVersion>;
    versionNumber$: Observable<number>;
    isCurrent$: Observable<boolean>;
    hasXml$: Observable<boolean>;
    filters$: Observable<unknown[]>;
    model$: Observable<Metadata>;
    definition: Wizard<any>;
    id: string;
    kind: string;

    htmlTags = ['DIV', 'A', 'METADATA-CONFIGURATION', 'METADATA-HEADER'];
    currentSection: string;

    constructor(
        private store: Store<ConfigurationState>,
        private modalService: NgbModal,
        private router: Router,
        private scroller: ViewportScroller
    ) {
        this.configuration$ = this.store.select(getConfigurationSections);
        this.model$ = this.store.select(getConfigurationModel);
        this.isEnabled$ = this.store.select(getConfigurationModelEnabled);
        this.version$ = this.store.select(getSelectedVersion);
        this.versionNumber$ = this.store.select(getSelectedVersionNumber);
        this.isCurrent$ = this.store.select(getSelectedIsCurrent);
        this.hasXml$ = this.store.select(getConfigurationHasXml);
        this.filters$ = this.store.select(getAdditionalFilters);

        this.model$
            .pipe(
                takeUntil(this.ngUnsubscribe),
                filter(model => !!model)
            )
            .subscribe(p => this.setModel(p));

        this.store.select(getConfigurationDefinition)
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(d => this.definition = d);
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

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        this.store.dispatch(new ClearFilters());
    }
}
