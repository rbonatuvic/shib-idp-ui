import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as editorActions from '../action/editor.action';
import * as draft from '../../domain/action/draft-collection.action';
import * as provider from '../../domain/action/provider-collection.action';
import { ProviderCollectionActionTypes } from '../../domain/action/provider-collection.action';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDraftService } from '../../domain/service/entity-draft.service';

@Injectable()
export class WizardEffects {

    @Effect({ dispatch: false })
    updateProvider$ = this.actions$
        .ofType<editorActions.SaveChanges>(editorActions.SAVE_CHANGES)
        .map(action => action.payload)
        .switchMap(provider => {
            return this.draftService.update(provider);
        });
    @Effect()
    addProviderSuccessDiscard$ = this.actions$
        .ofType<provider.AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS)
        .map(action => action.payload)
        .map(provider => {
            return new editorActions.ResetChanges();
        });

    constructor(
        private actions$: Actions,
        private draftService: EntityDraftService
    ) { }
}
