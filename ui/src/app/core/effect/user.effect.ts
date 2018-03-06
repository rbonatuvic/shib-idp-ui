import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Location } from '@angular/common';

import * as user from '../action/user.action';
import { User } from '../model/user';
import { UserService } from '../service/user.service';

@Injectable()
export class UserEffects {

    @Effect()
    loadUser$ = this.actions$
        .ofType(user.USER_LOAD_REQUEST)
        .switchMap(() =>
            this.userService
                .get()
                .map(u => new user.UserLoadSuccessAction({ ...u }))
                .catch(error => of(new user.UserLoadErrorAction(error)))
        );
    @Effect({dispatch: false})
    redirect$ = this.actions$
        .ofType(user.REDIRECT)
        .map((action: user.UserRedirect) => action.payload)
        .do(path => {
            window.location.href = path;
        });

    constructor(
        private userService: UserService,
        private actions$: Actions
    ) { }
}  /* istanbul ignore next */
