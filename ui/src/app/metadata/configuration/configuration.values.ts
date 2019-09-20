import { MetadataSourceEditor } from '../domain/model/wizards/metadata-source-editor';

export enum PATHS {
    resolver = 'EntityDescriptor',
    provider = 'MetadataResolvers'
}

export enum TYPES {
    resolver = 'resolver',
    provider = 'provider'
}

export const DEFINITIONS = {
    resolver: MetadataSourceEditor
};

export const CONFIG_DATE_FORMAT = 'MMM dd, yyyy HH:mm:ss';
