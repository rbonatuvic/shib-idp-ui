import { MetadataFilter, RelyingPartyOverrides } from '../model/metadata-filter';
import { DomainTypes } from '../domain.type';

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

    get name(): string {
        return this.filterName;
    }

    get enabled(): boolean {
        return this.filterEnabled;
    }

    get type(): string {
        return DomainTypes.filter;
    }
}
