import { MetadataFilter } from './model/metadata-filter';
import { MetadataProvider } from './model/metadata-provider';

export * from './model/metadata-provider';
export * from './model/metadata-filter';

export enum DomainTypes {
    filter = 'filter',
    provider = 'provider'
}

export type MetadataEntity =
    | MetadataFilter
    | MetadataProvider;
