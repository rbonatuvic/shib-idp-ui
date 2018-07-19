import { MetadataProvider } from '../metadata-provider';

export interface BaseMetadataProvider extends MetadataProvider {
    metadataFilters: any[];
}
