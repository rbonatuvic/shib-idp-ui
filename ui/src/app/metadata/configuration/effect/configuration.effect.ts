import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import { Store } from '@ngrx/store';

import { MetadataConfigurationService } from '../service/configuration.service';
import {
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
import {
    SelectProviderRequest, SelectProviderSuccess, ProviderCollectionActionTypes
} from '../../provider/action/collection.action';
import {
    SelectResolver,
    SelectResolverSuccess,
    ResolverCollectionActionTypes
} from '../../resolver/action/collection.action';

@Injectable()
export class MetadataConfigurationEffects {

    @Effect()
    loadMetadata$ = this.actions$.pipe(
        ofType<SetMetadata>(ConfigurationActionTypes.SET_METADATA),
        map(action => action.payload),
        map(payload => {
            const action = (payload.type === 'resolver') ?
                new SelectResolver(payload.id) :
                new SelectProviderRequest(payload.id);
            return action;
        })
    );

    @Effect()
    loadMetadataXml$ = this.actions$.pipe(
        ofType<SetMetadata>(ConfigurationActionTypes.SET_METADATA),
        filter(action => action.payload.type === 'resolver'),
        switchMap(action => this.resolverService.preview(action.payload.id).pipe(
            map(xml => new LoadXmlSuccess(xml)),
            catchError(error => of(new LoadXmlError(error)))
        ))
    );

    @Effect()
    setXmlOnLoad$ = this.actions$.pipe(
        ofType<LoadXmlSuccess>(ConfigurationActionTypes.LOAD_XML_SUCCESS),
        map(action => new SetXml(action.payload))
    );

    @Effect()
    setDefinitionOnResolverDataLoad$ = this.actions$.pipe(
        ofType<SelectResolverSuccess>(ResolverCollectionActionTypes.SELECT_SUCCESS),
        map(action => new SetDefinition(this.configService.getDefinition('resolver')))
    );

    @Effect()
    setDefinitionOnProviderLoad$ = this.actions$.pipe(
        ofType<SelectProviderSuccess>(ProviderCollectionActionTypes.SELECT_PROVIDER_SUCCESS),
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
        private resolverService: ResolverService,
        private entityService: EntityIdService,
        private store: Store<State>
    ) { }
}