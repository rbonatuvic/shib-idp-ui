import {
    MetadataProvider,
    MetadataResolver,
    MetadataFilter
} from './model';

export enum MetadataTypes {
    FILTER = '[Type] Metadata Filter',
    PROVIDER = '[Type] Metadata Provider',
    RESOLVER = '[Type] Metadata Resolver'
}

export type Metadata =
    | MetadataProvider
    | MetadataResolver
    | MetadataFilter;
