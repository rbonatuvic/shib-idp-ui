import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { EntityDescriptorService } from '../service/entity-descriptor.service';
import { MetadataResolverService } from '../service/metadata-resolver.service';
import { PreviewDialogComponent } from '../../shared/preview/preview-dialog.component';
import { MetadataEntity, DomainTypes } from '../domain.type';
import { EntityIdService } from '../service/entity-id.service';
import * as entityActions from '../action/entity.action';


@Injectable()
export class EntityEffects {

    @Effect({ dispatch: false })
    previewEntityXml$ = this.actions$.pipe(
        ofType<entityActions.PreviewEntity>(entityActions.PREVIEW_ENTITY),
        map(action => action.payload),
        tap(entity => this.openModal(entity))
    );

    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private providerService: EntityDescriptorService,
        private entityService: EntityIdService
    ) { }

    openModal(entity: MetadataEntity): void {
        let request: Observable<string> = entity.type === DomainTypes.filter ?
            this.entityService.preview(entity.entityId) : this.providerService.preview(entity.id);
        request.subscribe(xml => {
            let modal = this.modalService.open(PreviewDialogComponent, {
                size: 'lg',
                windowClass: 'modal-xl'
            });
            modal.componentInstance.entity = entity;
            modal.componentInstance.xml = xml;
        });
    }
} /* istanbul ignore next */
