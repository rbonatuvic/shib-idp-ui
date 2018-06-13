import {
    MetadataBase,
    FilterTarget,
    RelyingPartyOverrides
} from '../model';

export interface MetadataFilter extends MetadataBase {
    entityId: string;
    filterName: string;
    filterEnabled?: boolean;
    relyingPartyOverrides: RelyingPartyOverrides;
    attributeRelease: string[];
    filterTarget: FilterTarget;

    serialize(): any;
}
