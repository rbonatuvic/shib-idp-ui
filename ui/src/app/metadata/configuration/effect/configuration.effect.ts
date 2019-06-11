import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap, withLatestFrom } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import { Store } from '@ngrx/store';

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
    LoadSchemaError,
    LoadXmlSuccess,
    LoadXmlError,
    SetXml,
    DownloadXml
} from '../action/configuration.action';
import { ResolverService } from '../../domain/service/resolver.service';
import { EntityIdService } from '../../domain/service/entity-id.service';
import { State } from '../reducer/configuration.reducer';
import { getConfigurationModel, getConfigurationXml } from '../reducer';
import { MetadataResolver } from '../../domain/model';

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
    loadMetadataXml$ = this.actions$.pipe(
        ofType<LoadMetadataRequest>(ConfigurationActionTypes.LOAD_METADATA_REQUEST),
        switchMap(action => {
            let loader: Observable<string>;
            switch (action.payload.type) {
                case 'filter':
                    loader = this.entityService.preview(action.payload.id);
                    break;
                default:
                    loader = this.providerService.preview(action.payload.id);
                    break;
            }

            return loader.pipe(
                map(xml => new LoadXmlSuccess(xml)),
                catchError(error => of(new LoadXmlError(error)))
            );
        })
    );

    @Effect()
    setXmlOnLoad$ = this.actions$.pipe(
        ofType<LoadXmlSuccess>(ConfigurationActionTypes.LOAD_XML_SUCCESS),
        map(action => new SetXml(action.payload))
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

    @Effect({dispatch: false})
    downloadXml$ = this.actions$.pipe(
        ofType<DownloadXml>(ConfigurationActionTypes.DOWNLOAD_XML),
        withLatestFrom(
            this.store.select(getConfigurationModel),
            this.store.select(getConfigurationXml)
        ),
        tap(([action, entity, xml]) => {
            const name = entity.name ? entity.name : (entity as MetadataResolver).serviceProviderName;
            const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
            FileSaver.saveAs(blob, `${name}.xml`);
        })
    );

    constructor(
        private configService: MetadataConfigurationService,
        private actions$: Actions,
        private providerService: ResolverService,
        private entityService: EntityIdService,
        private store: Store<State>
    ) { }
}
