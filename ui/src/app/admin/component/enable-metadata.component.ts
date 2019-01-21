import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataEntity, MetadataResolver } from '../../metadata/domain/model';
import * as fromDashboard from '../../metadata/manager/reducer';
import * as fromResolver from '../../metadata/resolver/reducer';
import { ToggleEntityDisplay } from '../../metadata/manager/action/manager.action';
import { DeleteDialogComponent } from '../../metadata/manager/component/delete-dialog.component';
import { PreviewEntity } from '../../metadata/domain/action/entity.action';
import { RemoveDraftRequest } from '../../metadata/resolver/action/draft.action';
import { LoadAdminResolverRequest } from '../../metadata/resolver/action/collection.action';

@Component({
    selector: 'enable-metadata',
    templateUrl: './enable-metadata.component.html'
})

export class EnableMetadataComponent implements OnInit {
    resolvers$: Observable<MetadataEntity[]>;
    loading$: Observable<boolean>;

    total$: Observable<number>;
    page = 1;
    limit = 8;

    entitiesOpen$: Observable<{ [key: string]: boolean }>;

    constructor(
        private store: Store<fromDashboard.DashboardState>,
        private router: Router,
        private modalService: NgbModal
    ) {
        this.resolvers$ = store.select(fromResolver.getAllResolvers);
        this.loading$ = store.select(fromDashboard.getSearchLoading);
        this.entitiesOpen$ = store.select(fromDashboard.getOpenProviders);

        this.total$ = this.resolvers$.pipe(map(list => list.length));
    }

    ngOnInit(): void {
        this.store.dispatch(new LoadAdminResolverRequest());
    }

    edit(entity: MetadataEntity): void {
        this.router.navigate(['metadata', 'resolver', entity.getId(), 'edit']);
    }

    toggleEntity(entity: MetadataEntity): void {
        this.store.dispatch(new ToggleEntityDisplay(entity.getId()));
    }

    openPreviewDialog(entity: MetadataEntity): void {
        this.store.dispatch(new PreviewEntity({ id: entity.getId(), entity }));
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
