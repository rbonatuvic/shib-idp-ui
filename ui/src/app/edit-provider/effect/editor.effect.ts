import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as editor from '../action/editor.action';
import * as provider from '../../metadata-provider/action/provider.action';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';
import { EntityDescriptorService } from '../../metadata-provider/service/entity-descriptor.service';
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
