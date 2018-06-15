import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ResolverService } from '../service/resolver.service';
import { PreviewDialogComponent } from '../component/preview-dialog.component';
import { MetadataEntity } from '../model';
import { MetadataTypes } from '../domain.type';
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
        private providerService: ResolverService,
        private entityService: EntityIdService
    ) { }

    openModal(entity: MetadataEntity): void {
        let request: Observable<string> = entity.kind === MetadataTypes.FILTER ?
            this.entityService.preview(entity.getId()) : this.providerService.preview(entity.getId());
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
