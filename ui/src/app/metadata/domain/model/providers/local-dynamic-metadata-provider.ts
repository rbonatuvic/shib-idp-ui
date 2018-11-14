import { BaseMetadataProvider } from './base-metadata-provider';

export interface LocalDynamicMetadataProvider extends BaseMetadataProvider {
    id: string;
    sourceDirectory: string;
    reloadableMetadataResolverAttributes: any;
}
