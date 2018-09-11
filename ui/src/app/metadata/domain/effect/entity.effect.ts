import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ResolverService } from '../service/resolver.service';
import { PreviewDialogComponent } from '../component/preview-dialog.component';
import { MetadataEntity } from '../model';
import { MetadataTypes } from '../domain.type';
import { EntityIdService } from '../service/entity-id.service';
import * as entityActions from '../action/entity.action';

import * as fromRoot from '../../../app.reducer';

import { AddNotification } from '../../../notification/action/notification.action';
import { Notification, NotificationType } from '../../../notification/model/notification';

@Injectable()
export class EntityEffects {

    @Effect({ dispatch: false })
    previewEntityXml$ = this.actions$.pipe(
        ofType<entityActions.PreviewEntity>(entityActions.PREVIEW_ENTITY),
        map(action => action.payload),
        tap(prev => this.openModal(prev))
    );

    constructor(
        private actions$: Actions,
        private modalService: NgbModal,
        private providerService: ResolverService,
        private entityService: EntityIdService,
        private store: Store<fromRoot.State>
    ) { }

    openModal(prev: { id: string, entity: MetadataEntity }): void {
        let { id, entity } = prev,
            request: Observable<string> = entity.kind === MetadataTypes.FILTER ?
            this.entityService.preview(id) : this.providerService.preview(id);
        request.subscribe(
            xml => {
                let modal = this.modalService.open(PreviewDialogComponent, {
                    size: 'lg',
                    windowClass: 'modal-xl'
                });
                modal.componentInstance.entity = entity;
                modal.componentInstance.xml = xml;
            },
            err => {
                this.store.dispatch(new AddNotification(new Notification(
                    NotificationType.Danger,
                    `Unable to preview entity.`,
                    8000
                )));
            }
        );
    }
} /* istanbul ignore next */
