import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
    ConfigurationState,
    getConfigurationSections,
    getSelectedVersion,
    getSelectedVersionNumber,
    getSelectedIsCurrent,
    getConfigurationModelEnabled,
    getConfigurationHasXml,
    getConfigurationModel,
    getConfigurationModelKind
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
import { takeUntil, map } from 'rxjs/operators';
import { Metadata } from '../../domain/domain.type';
import { DeleteFilterComponent } from '../../provider/component/delete-filter.component';
import { ModalService } from '../../../core/service/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    id: string;
    kind: string;

    constructor(
        private store: Store<ConfigurationState>,
        private modalService: NgbModal
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
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(p => {
                this.id = p.resourceId;
                this.kind = '@type' in p ? 'provider' : 'resolver';
                if (this.kind === 'provider') {
                    this.store.dispatch(new LoadFilterRequest(this.id));
                }
            });
    }

    updateOrderUp(filter: MetadataFilter): void {
        this.store.dispatch(new ChangeFilterOrderUp(filter.resourceId));
    }

    updateOrderDown(filter: MetadataFilter): void {
        this.store.dispatch(new ChangeFilterOrderDown(filter.resourceId));
    }

    removeFilter(id: string): void {
        console.log(id);
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
