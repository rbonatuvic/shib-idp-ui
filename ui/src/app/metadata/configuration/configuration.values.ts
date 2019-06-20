import { MetadataSourceEditor } from '../domain/model/wizards/metadata-source-editor';

export enum PATHS {
    resolver = 'EntityDescriptor',
    provider = 'MetadataResolvers'
}

export const DEFINITIONS = {
    resolver: MetadataSourceEditor
};
