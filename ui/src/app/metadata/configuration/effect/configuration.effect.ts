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
    SetDefinition,
    LoadSchemaRequest,
    LoadSchemaSuccess,
    SetSchema,
    LoadSchemaError
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
    setDefinition$ = this.actions$.pipe(
        ofType<SetMetadata>(ConfigurationActionTypes.SET_METADATA),
        map(action => new SetDefinition(this.configService.getDefinition(action.payload['@type'])))
    );

    @Effect()
    loadSchemaOnDefinitionSet$ = this.actions$.pipe(
        ofType<SetDefinition>(ConfigurationActionTypes.SET_DEFINITION),
        map(action => new LoadSchemaRequest(action.payload.schema))
    );

    @Effect()
    loadSchemaData$ = this.actions$.pipe(
        ofType<LoadSchemaRequest>(ConfigurationActionTypes.LOAD_SCHEMA_REQUEST),
        switchMap(action =>
            this.configService
                .loadSchema(action.payload)
                .pipe(
                    map(schema => new LoadSchemaSuccess(schema)),
                    catchError(error => of(new LoadSchemaError(error)))
                )
        )
    );

    @Effect()
    setSchema$ = this.actions$.pipe(
        ofType<LoadSchemaSuccess>(ConfigurationActionTypes.LOAD_SCHEMA_SUCCESS),
        map(action => new SetSchema(action.payload))
    );

    constructor(
        private configService: MetadataConfigurationService,
        private actions$: Actions
    ) { }
}
