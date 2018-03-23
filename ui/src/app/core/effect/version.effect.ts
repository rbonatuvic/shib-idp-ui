import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import * as version from '../action/version.action';
import { VersionInfo } from '../model/version';

@Injectable()
export class VersionEffects {

    private endpoint = '/info';
    private base = '/actuator';

    @Effect()
    loadVersionInfo$ = this.actions$
        .ofType(version.VERSION_LOAD_REQUEST)
        .switchMap(() =>
            this.http
                .get<VersionInfo>(`${this.base}${this.endpoint}`)
                .map(info => new version.VersionInfoLoadSuccessAction(info) )
                .catch(error => of(new version.VersionInfoLoadErrorAction(error)))
        );

    constructor(
        private http: HttpClient,
        private actions$: Actions
    ) { }
}  /* istanbul ignore next */
