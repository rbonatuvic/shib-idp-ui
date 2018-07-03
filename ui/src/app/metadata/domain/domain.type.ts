import {
    MetadataProvider,
    MetadataResolver,
    MetadataFilter
} from './model';

import {
    EntityAttributesFilter,
    FileBackedHttpMetadataResolver
} from './entity';
import {
    FileBackedHttpMetadataProvider
} from './model/providers';

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
