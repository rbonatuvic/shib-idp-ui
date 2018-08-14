import { MetadataBase } from './metadata-base';

export interface MetadataFilter extends MetadataBase {
    name: string;
    filterEnabled?: boolean;
    type: string;
    resourceId: string;

    [key: string]: any;
}
