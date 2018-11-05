import { BaseMetadataProvider } from './base-metadata-provider';

export interface FileSystemMetadataProvider extends BaseMetadataProvider {
    id: string;
    metadataFile: string;
    reloadableMetadataResolverAttributes: any;
}
