import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import {
    ProviderCollectionActionsUnion,
    ProviderCollectionActionTypes,
    AddProviderRequest,
    AddProviderSuccess,
    AddProviderFail
} from '../action/collection.action';
import { MetadataProviderService } from '../../domain/service/provider.service';

/* istanbul ignore next */
@Injectable()
export class CollectionEffects {

    @Effect()
    createProvider$ = this.actions$.pipe(
        ofType<AddProviderRequest>(ProviderCollectionActionTypes.ADD_PROVIDER_REQUEST),
        map(action => action.payload),
        switchMap(provider =>
            this.providerService
                .save(provider)
                .pipe(
                    map(p => new AddProviderSuccess(p)),
                    catchError((e) => of(new AddProviderFail(e)))
                )
        )
    );

    @Effect({ dispatch: false })
    createProviderSuccessRedirect$ = this.actions$.pipe(
        ofType<AddProviderSuccess>(ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS),
        map(action => action.payload),
        tap(provider => this.router.navigate(['metadata']))
    );

    /*
    @Effect()
    addResolverSuccessReload$ = this.actions$.pipe(
        ofType<CreateProviderSuccess>(EntityActionTypes.CREATE_PROVIDER_SUCCESS),
        map(action => action.payload),
        map(provider => new LoadProviderRequest())
    );
    */

    constructor(
        private actions$: Actions,
        private router: Router,
        private providerService: MetadataProviderService
    ) { }
} /* istanbul ignore next */
