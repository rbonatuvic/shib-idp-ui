import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

import * as user from '../action/user.action';
import { LoadRoleRequest, LoadRoleFail, LoadRoleSuccess, ConfigurationActionTypes } from '../action/configuration.action';
import { UserService } from '../service/user.service';

@Injectable()
export class UserEffects {

    @Effect()
    loadRoles$ = this.actions$.pipe(
        ofType<LoadRoleRequest>(ConfigurationActionTypes.LOAD_ROLE_REQUEST),
        switchMap(() =>
            this.userService.getRoles()
                .pipe(
                    map(roles => new LoadRoleSuccess(roles)),
                    catchError(error => of(new LoadRoleFail()))
                )
        )
    );

    @Effect({dispatch: false})
    redirect$ = this.actions$.pipe(
        ofType(user.REDIRECT),
        map((action: user.UserRedirect) => action.payload),
        tap(path => {
            window.location.href = path;
        })
    );

    constructor(
        private userService: UserService,
        private actions$: Actions
    ) { }
}
