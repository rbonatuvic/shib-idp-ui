import { MetadataProvider } from '../metadata-provider';

export interface FileBackedHttpMetadataProvider extends MetadataProvider {
    metadataFilters: any[];
}
