import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataEntity, MetadataResolver } from '../../metadata/domain/model';
import * as fromDashboard from '../../metadata/manager/reducer';
import * as fromMetadata from '../reducer';
import { DeleteDialogComponent } from '../../metadata/manager/component/delete-dialog.component';
import { PreviewEntity } from '../../metadata/domain/action/entity.action';
import { FileBackedHttpMetadataResolver } from '../../metadata/domain/entity';
import { RemoveMetadataRequest, UpdateMetadataRequest } from '../action/metadata-collection.action';

@Component({
    selector: 'enable-metadata',
    templateUrl: './enable-metadata.component.html'
})

export class EnableMetadataComponent {
    resolvers$: Observable<FileBackedHttpMetadataResolver[]> = this.store
        .select(fromMetadata.getMetadataCollection)
        .pipe(
            map(resolvers => resolvers.map(r => new FileBackedHttpMetadataResolver(r)))
        );

    constructor(
        private store: Store<fromDashboard.DashboardState>,
        private router: Router,
        private modalService: NgbModal
    ) {}

    edit(entity: MetadataEntity): void {
        this.router.navigate(['metadata', 'resolver', entity.getId(), 'edit']);
    }

    openPreviewDialog(entity: MetadataEntity): void {
        this.store.dispatch(new PreviewEntity({ id: entity.getId(), entity }));
    }

    toggleResolverEnabled(entity: MetadataResolver): void {
        let update = { ...entity, serviceEnabled: !entity.serviceEnabled };
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
