import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as dashboardActions from '../action/dashboard.action';
import { PreviewProviderDialogComponent } from '../../metadata-provider/component/preview-provider-dialog.component';

@Injectable()
export class DashboardEffects {

    @Effect({ dispatch: false })
    previewProviderXml$ = this.actions$
        .ofType<dashboardActions.PreviewEntity>(dashboardActions.PREVIEW_ENTITY)
        .map(action => action.payload)
        .switchMap(provider => {
            let modal = this.modalService.open(PreviewProviderDialogComponent, {
                size: 'lg',
                windowClass: 'modal-xl'
            });
            modal.componentInstance.provider = provider;
            return modal.result.then(
                result => result,
                err => err
            );
        });

    constructor(
        private actions$: Actions,
        private modalService: NgbModal
    ) { }
} /* istanbul ignore next */
