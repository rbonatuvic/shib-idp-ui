import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataEntity, MetadataResolver } from '../../metadata/domain/model';
import * as fromDashboard from '../../metadata/manager/reducer';
import * as fromMetadata from '../reducer';
import { ToggleEntityDisplay } from '../../metadata/manager/action/manager.action';
import { DeleteDialogComponent } from '../../metadata/manager/component/delete-dialog.component';
import { PreviewEntity } from '../../metadata/domain/action/entity.action';
import { FileBackedHttpMetadataResolver } from '../../metadata/domain/entity';
import { RemoveMetadataRequest, UpdateMetadataRequest, LoadMetadataRequest } from '../action/metadata-collection.action';

@Component({
    selector: 'enable-metadata',
    templateUrl: './enable-metadata.component.html'
})

export class EnableMetadataComponent implements OnInit {
    resolvers$: Observable<FileBackedHttpMetadataResolver[]>;
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
        this.store.dispatch(new LoadMetadataRequest());

        this.resolvers$ = this.store
            .select(fromMetadata.getMetadataCollection)
            .pipe(
                map(resolvers => resolvers.map(r => new FileBackedHttpMetadataResolver(r)))
            );
        this.loading$ = this.store.select(fromDashboard.getSearchLoading);
        this.entitiesOpen$ = this.store.select(fromDashboard.getOpenProviders);

        this.total$ = this.resolvers$.pipe(map(list => list.length));
    }

    ngOnInit(): void {}

    edit(entity: MetadataEntity): void {
        this.router.navigate(['metadata', 'resolver', entity.getId(), 'edit']);
    }

    toggleEntity(entity: MetadataEntity): void {
        this.store.dispatch(new ToggleEntityDisplay(entity.getId()));
    }

    openPreviewDialog(entity: MetadataEntity): void {
        this.store.dispatch(new PreviewEntity({ id: entity.getId(), entity }));
    }

    toggleResolverEnabled(entity: MetadataResolver, enabled: boolean): void {
        let update = { ...entity, serviceEnabled: enabled };
        this.store.dispatch(new UpdateMetadataRequest(update));
    }

    deleteResolver(entity: MetadataResolver): void {
        this.modalService
            .open(DeleteDialogComponent)
            .result
            .then(
                success => {
                    this.store.dispatch(new RemoveMetadataRequest(entity));
                },
                err => {
                    console.log('Cancelled');
                }
            );
    }
}
