import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as fromProvider from '../reducer';
import * as fromCollection from '../../domain/reducer';

import {
    CopySourceActionUnion,
    CopySourceActionTypes,
    CreateProviderCopyRequest,
    CreateProviderCopySuccess,
    CreateProviderCopyError
} from '../action/copy.action';
import { Resolver } from '../../domain/entity/provider';


@Injectable()
export class CopyProviderEffects {

    @Effect()
    copyRequest$ = this.actions$.pipe(
        ofType<CreateProviderCopyRequest>(CopySourceActionTypes.CREATE_PROVIDER_COPY_REQUEST),
        map(action => action.payload),
        withLatestFrom(
            this.store.select(fromCollection.getProviderCollection),
            this.store.select(fromProvider.getSectionsToCopy)
        ),
        switchMap(([attrs, providers, sections]) => {
            const { serviceProviderName, entityId } = attrs;
            const provider = providers.find(p => p.entityId === attrs.target);
            const copied = sections.reduce((c, section) => ({ ...c, ...{[section]: provider[section] } }), {});
            const action = provider ?
                new CreateProviderCopySuccess(new Resolver({
                    serviceProviderName,
                    entityId,
                    ...copied
                })) :
                new CreateProviderCopyError(new Error('Not found'));
            return of(action);
        }));

    @Effect({ dispatch: false })
    copyOnCreation$ = this.actions$.pipe(
        ofType<CopySourceActionUnion>(CopySourceActionTypes.CREATE_PROVIDER_COPY_SUCCESS),
        switchMap(() => this.router.navigate(['/new/copy/confirm']))
    );

    constructor(
        private actions$: Actions,
        private store: Store<fromProvider.State>,
        private router: Router
    ) { }
}
