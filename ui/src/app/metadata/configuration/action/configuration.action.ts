import { Action } from '@ngrx/store';
import { Metadata } from '../../domain/domain.type';
import { Schema } from '../model/schema';
import { Wizard } from '../../../wizard/model';

export enum ConfigurationActionTypes {
    LOAD_METADATA_REQUEST = '[Metadata Configuration] Load Metadata Request',
    LOAD_METADATA_SUCCESS = '[Metadata Configuration] Load Metadata Success',
    LOAD_METADATA_ERROR = '[Metadata Configuration] Load Metadata Error',

    LOAD_SCHEMA_REQUEST = '[Metadata Configuration] Load Schema Request',
    LOAD_SCHEMA_SUCCESS = '[Metadata Configuration] Load Schema Success',
    LOAD_SCHEMA_ERROR = '[Metadata Configuration] Load Schema Error',

    LOAD_XML_REQUEST = '[Metadata Configuration] Load XML Request',
    LOAD_XML_SUCCESS = '[Metadata Configuration] Load XML Success',
    LOAD_XML_ERROR = '[Metadata Configuration] Load XML Error',

    SET_METADATA = '[Metadata Configuration] Set Metadata Model',
    SET_DEFINITION = '[Metadata Configuration] Set Metadata Definition',
    SET_SCHEMA = '[Metadata Configuration] Set Metadata Schema',
    SET_XML = '[Metadata Configuration] Set Metadata Xml',

    DOWNLOAD_XML = '[Metadata Configuration] Download Metadata Xml',

    CLEAR = '[Metadata Configuration] Clear'
}

export class LoadMetadataRequest implements Action {
    readonly type = ConfigurationActionTypes.LOAD_METADATA_REQUEST;

    constructor(public payload: { id: string, type: string }) { }
}

export class LoadMetadataSuccess implements Action {
    readonly type = ConfigurationActionTypes.LOAD_METADATA_SUCCESS;

    constructor(public payload: Metadata) { }
}

export class LoadMetadataError implements Action {
    readonly type = ConfigurationActionTypes.LOAD_METADATA_ERROR;

    constructor(public payload: any) { }
}

export class LoadSchemaRequest implements Action {
    readonly type = ConfigurationActionTypes.LOAD_SCHEMA_REQUEST;

    constructor(public payload: string) { }
}

export class LoadSchemaSuccess implements Action {
    readonly type = ConfigurationActionTypes.LOAD_SCHEMA_SUCCESS;

    constructor(public payload: Schema) { }
}

export class LoadSchemaError implements Action {
    readonly type = ConfigurationActionTypes.LOAD_SCHEMA_ERROR;

    constructor(public payload: any) { }
}

export class LoadXmlRequest implements Action {
    readonly type = ConfigurationActionTypes.LOAD_XML_REQUEST;

    constructor(public payload: string) { }
}

export class LoadXmlSuccess implements Action {
    readonly type = ConfigurationActionTypes.LOAD_XML_SUCCESS;

    constructor(public payload: string) { }
}

export class LoadXmlError implements Action {
    readonly type = ConfigurationActionTypes.LOAD_XML_ERROR;

    constructor(public payload: any) { }
}

export class SetMetadata implements Action {
    readonly type = ConfigurationActionTypes.SET_METADATA;

    constructor(public payload: Metadata) { }
}

export class SetDefinition implements Action {
    readonly type = ConfigurationActionTypes.SET_DEFINITION;

    constructor(public payload: Wizard<Metadata>) { }
}

export class SetSchema implements Action {
    readonly type = ConfigurationActionTypes.SET_SCHEMA;

    constructor(public payload: Schema) { }
}

export class SetXml implements Action {
    readonly type = ConfigurationActionTypes.SET_XML;

    constructor(public payload: string) { }
}

export class DownloadXml implements Action {
    readonly type = ConfigurationActionTypes.DOWNLOAD_XML;
}

export class ClearConfiguration implements Action {
    readonly type = ConfigurationActionTypes.CLEAR;
}

export type ConfigurationActionsUnion =
    | LoadMetadataRequest
    | LoadMetadataSuccess
    | LoadMetadataError
    | LoadSchemaRequest
    | LoadSchemaSuccess
    | LoadSchemaError
    | LoadXmlRequest
    | LoadXmlSuccess
    | LoadXmlError
    | SetMetadata
    | SetDefinition
    | SetSchema
    | SetXml
    | DownloadXml
    | ClearConfiguration;
