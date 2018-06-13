import {
    MetadataProvider,
    MetadataResolver,
    MetadataFilter
} from './model';

import {
    EntityAttributesFilter,
    FileBackedHttpMetadataResolver,
    FileBackedHttpMetadataProvider
} from './entity';

export type Filter =
    | EntityAttributesFilter;

export type Resolver =
    | FileBackedHttpMetadataResolver;

export type Provider =
    | FileBackedHttpMetadataProvider;

export type Entity =
    | Filter
    | Resolver
    | Provider;

export type Metadata =
    | MetadataProvider
    | MetadataResolver
    | MetadataFilter;

export enum MetadataTypes {
    FILTER = '[Type] Metadata Filter',
    PROVIDER = '[Type] Metadata Provider',
    RESOLVER = '[Type] Metadata Resolver'
}

export * from './model';
export * from './entity';
