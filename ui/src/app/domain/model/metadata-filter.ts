import { RelyingPartyOverrides } from './relying-party-overrides';
import { MetadataBase } from './metadata-base';

export interface MetadataFilter extends MetadataBase {
    entityId: string;
    filterName: string;
    filterEnabled?: boolean;
    relyingPartyOverrides: RelyingPartyOverrides;
    attributeRelease: string[];
}

export * from './relying-party-overrides';
