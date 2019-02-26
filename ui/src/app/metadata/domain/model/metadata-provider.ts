import {
    MetadataBase,
} from '../model';
import { MetadataFilter } from './metadata-filter';

export interface MetadataProvider extends MetadataBase {
    name: string;
    '@type': string;
    enabled: boolean;
    resourceId: string;
    xmlId: string;
    sortKey: number;
    metadataFilters: MetadataFilter[];
    reloadableMetadataResolverAttributes?: any;
}
