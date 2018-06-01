import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as version from '../action/version.action';
import { VersionInfo } from '../model/version';

@Injectable()
export class VersionEffects {

    private endpoint = '/info';
    private base = '/actuator';

    @Effect()
    loadVersionInfo$ = this.actions$
        .ofType(version.VERSION_LOAD_REQUEST)
        .pipe(
            switchMap(() =>
                this.http.get<VersionInfo>(`${this.base}${this.endpoint}`)
                    .pipe(
                        map(info => new version.VersionInfoLoadSuccessAction(info)),
                        catchError(error => of(new version.VersionInfoLoadErrorAction(error)))
                    )
            )
        );

    constructor(
        private http: HttpClient,
        private actions$: Actions
    ) { }
}  /* istanbul ignore next */
