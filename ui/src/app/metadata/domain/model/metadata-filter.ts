import { MetadataBase } from './metadata-base';

export interface MetadataFilter extends MetadataBase {
    entityId: string;
    name: string;
    filterEnabled?: boolean;
    type: string;
    resourceId: string;

    serialize(): any;
}
