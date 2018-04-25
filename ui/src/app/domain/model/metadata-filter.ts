import { RelyingPartyOverrides } from './relying-party-overrides';
import { MetadataBase } from './metadata-base';
import { FilterTarget } from './filter-target';

export interface MetadataFilter extends MetadataBase {
    entityId: string;
    filterName: string;
    filterEnabled?: boolean;
    relyingPartyOverrides: RelyingPartyOverrides;
    attributeRelease: string[];
    filterTarget: FilterTarget;

    serialize(): any;
}

export * from './relying-party-overrides';
