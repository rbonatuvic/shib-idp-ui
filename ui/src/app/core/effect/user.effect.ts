import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Location } from '@angular/common';

import { of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

import * as user from '../action/user.action';
import { User } from '../model/user';
import { UserService } from '../service/user.service';

@Injectable()
export class UserEffects {

    @Effect()
    loadUser$ = this.actions$.pipe(
        ofType(user.USER_LOAD_REQUEST),
        switchMap(() =>
            this.userService.get()
                .pipe(
                    map(u => new user.UserLoadSuccessAction({ ...u })),
                    catchError(error => of(new user.UserLoadErrorAction(error)))
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
