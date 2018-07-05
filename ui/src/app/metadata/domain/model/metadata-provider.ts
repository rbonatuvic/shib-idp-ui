import {
    MetadataBase,
} from '../model';

export interface MetadataProvider extends MetadataBase {
    name: string;
    '@type': string;
    enabled: boolean;
    resourceId: string;
}
