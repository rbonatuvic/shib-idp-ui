import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as fromResolver from '../reducer';

import {
    CopySourceActionUnion,
    CopySourceActionTypes,
    CreateResolverCopyRequest,
    CreateResolverCopySuccess,
    CreateResolverCopyError
} from '../action/copy.action';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';


@Injectable()
export class CopyResolverEffects {

    @Effect()
    copyRequest$ = this.actions$.pipe(
        ofType<CreateResolverCopyRequest>(CopySourceActionTypes.CREATE_RESOLVER_COPY_REQUEST),
        map(action => action.payload),
        withLatestFrom(
            this.store.select(fromResolver.getAllResolvers),
            this.store.select(fromResolver.getSectionsToCopy)
        ),
        switchMap(([attrs, providers, sections]) => {
            const { serviceProviderName, entityId } = attrs;
            const provider = providers.find(p => p.entityId === attrs.target);
            const copied = sections.reduce((c, section) => ({ ...c, ...{[section]: provider[section] } }), {});
            const action = provider ?
                new CreateResolverCopySuccess(new FileBackedHttpMetadataResolver({
                    serviceProviderName,
                    entityId,
                    ...copied
                })) :
                new CreateResolverCopyError(new Error('Not found'));
            return of(action);
        }));

    @Effect({ dispatch: false })
    copyOnCreation$ = this.actions$.pipe(
        ofType<CopySourceActionUnion>(CopySourceActionTypes.CREATE_RESOLVER_COPY_SUCCESS),
        switchMap(() => this.router.navigate(['/new/copy/confirm']))
    );

    constructor(
        private actions$: Actions,
        private store: Store<fromResolver.State>,
        private router: Router
    ) { }
}
