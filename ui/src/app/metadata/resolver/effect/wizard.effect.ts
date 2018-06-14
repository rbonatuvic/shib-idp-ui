import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { map, switchMap } from 'rxjs/operators';

import * as editorActions from '../action/editor.action';
import * as draft from '../../domain/action/draft-collection.action';
import * as provider from '../../domain/action/provider-collection.action';
import { ProviderCollectionActionTypes } from '../../domain/action/provider-collection.action';
import { MetadataResolver } from '../../domain/model/metadata-provider';
import { EntityDraftService } from '../../domain/service/entity-draft.service';

@Injectable()
export class WizardEffects {

    @Effect({ dispatch: false })
    updateProvider$ = this.actions$.pipe(
        ofType<editorActions.SaveChanges>(editorActions.SAVE_CHANGES),
        map(action => action.payload),
        switchMap(provider => this.draftService.update(provider))
    );

    @Effect()
    addProviderSuccessDiscard$ = this.actions$.pipe(
        ofType<provider.AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        map(provider => new editorActions.ResetChanges())
    );

    constructor(
        private actions$: Actions,
        private draftService: EntityDraftService
    ) { }
}
