import { BaseMetadataProvider } from './base-metadata-provider';

export interface FileBackedHttpMetadataProvider extends BaseMetadataProvider {
    id: string;
    metadataURL: string;
    reloadableMetadataResolverAttributes: any;
}
