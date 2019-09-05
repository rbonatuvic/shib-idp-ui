import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewportScroller } from '@angular/common';
import { takeUntil, filter } from 'rxjs/operators';

import {
    ConfigurationState,
    getConfigurationSections,
    getSelectedVersion,
    getConfigurationModelEnabled,
    getConfigurationModelType,
    getVersionModelFilters,
    getVersionLoading
} from '../reducer';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { MetadataVersion } from '../model/version';
import {
    ClearFilters
} from '../../filter/action/collection.action';

import { Metadata } from '../../domain/domain.type';
import { getVersionModel, getVersionConfigurationSections } from '../reducer';

@Component({
    selector: 'version-options-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './version-options.component.html',
    styleUrls: []
})
export class VersionOptionsComponent implements OnDestroy {

    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    configuration$: Observable<MetadataConfiguration> = this.store.select(getVersionConfigurationSections);
    isEnabled$: Observable<boolean> = this.store.select(getConfigurationModelEnabled);
    model$: Observable<Metadata> = this.store.select(getVersionModel);
    type$: Observable<string> = this.store.select(getConfigurationModelType);
    filters$: Observable<any[]> = this.store.select(getVersionModelFilters);
    loading$: Observable<boolean> = this.store.select(getVersionLoading);
    id: string;
    kind: string;

    constructor(
        protected store: Store<ConfigurationState>,
        protected modalService: NgbModal,
        protected scroller: ViewportScroller
    ) {
        this.model$
            .pipe(
                takeUntil(this.ngUnsubscribe),
                filter(model => !!model)
            )
            .subscribe(p => this.setModel(p));
    }

    setModel(data: Metadata): void {
        this.id = 'resourceId' in data ? data.resourceId : data.id;
        this.kind = '@type' in data ? 'provider' : 'resolver';
    }

    onScrollTo(element): void {
        this.scroller.scrollToAnchor(element);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        this.store.dispatch(new ClearFilters());
    }
}
