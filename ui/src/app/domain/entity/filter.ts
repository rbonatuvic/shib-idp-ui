import { MetadataFilter, RelyingPartyOverrides } from '../model/metadata-filter';

export class Filter implements MetadataFilter {
    id = '';
    createdDate?: string;
    modifiedDate?: string;

    entityId = '';
    filterName = '';
    filterEnabled = false;

    relyingPartyOverrides = {
        nameIdFormats: [] as string[],
        authenticationMethods: [] as string[]
    } as RelyingPartyOverrides;

    attributeRelease = [] as string[];

    constructor(obj?: Partial<MetadataFilter>) {
        Object.assign(this, obj);
    }
}
