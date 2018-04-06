import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as editor from '../action/editor.action';
import * as provider from '../../domain/action/provider-collection.action';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDescriptorService } from '../../domain/service/entity-descriptor.service';
import { Router } from '@angular/router';

@Injectable()
export class EditorEffects {

    @Effect({dispatch: false})
    cancelChanges$ = this.actions$
        .ofType<editor.CancelChanges>(editor.CANCEL_CHANGES)
        .switchMap(() => this.router.navigate(['/dashboard']));

    @Effect()
    updateProviderSuccessRedirect$ = this.actions$
        .ofType<provider.UpdateProviderSuccess>(provider.UPDATE_PROVIDER_SUCCESS)
        .map(action => action.payload)
        .map(p => new editor.ResetChanges());

    constructor(
        private actions$: Actions,
        private router: Router
    ) { }
}
