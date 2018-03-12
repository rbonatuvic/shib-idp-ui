import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as filter from '../action/collection.action';
import { Router } from '@angular/router';

@Injectable()
export class FilterEffects {

    @Effect({ dispatch: false })
    cancelChanges$ = this.actions$
        .ofType<filter.CancelCreateFilter>(filter.CANCEL_CREATE_FILTER)
        .map(action => action.payload)
        .switchMap(() => this.router.navigate(['/dashboard']));

    constructor(
        private actions$: Actions,
        private router: Router
    ) { }
}
