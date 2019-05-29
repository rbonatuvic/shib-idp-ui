import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { MetadataConfigurationService } from '../service/configuration.service';
import {
    LoadMetadataRequest,
    LoadMetadataSuccess,
    LoadMetadataError,
    ConfigurationActionTypes,
    SetMetadata,
    SetDefinition
} from '../action/configuration.action';

@Injectable()
export class MetadataConfigurationEffects {

    @Effect()
    loadMetadata$ = this.actions$.pipe(
        ofType<LoadMetadataRequest>(ConfigurationActionTypes.LOAD_METADATA_REQUEST),
        switchMap(action =>
            this.configService
                .find(action.payload.id, action.payload.type)
                .pipe(
                    map(md => new LoadMetadataSuccess(md)),
                    catchError(error => of(new LoadMetadataError(error)))
                )
        )
    );

    @Effect()
    setMetadataOnLoad$ = this.actions$.pipe(
        ofType<LoadMetadataSuccess>(ConfigurationActionTypes.LOAD_METADATA_SUCCESS),
        map(action => new SetMetadata(action.payload))
    );

    @Effect()
    setDefinitionOnMetadataSet$ = this.actions$.pipe(
        ofType<SetMetadata>(ConfigurationActionTypes.SET_METADATA),
        map(action => new SetDefinition(this.configService.getDefinition(action.payload)))
    );

    constructor(
        private configService: MetadataConfigurationService,
        private actions$: Actions
    ) { }
}
