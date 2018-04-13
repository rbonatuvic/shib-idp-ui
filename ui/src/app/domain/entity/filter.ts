import { MetadataFilter, RelyingPartyOverrides } from '../model/metadata-filter';
import { DomainTypes } from '../domain.type';
import { FilterTarget } from '../model/filter-target';

export class Filter implements MetadataFilter {
    id = '';
    createdDate?: string;
    modifiedDate?: string;

    filterName = '';
    filterEnabled = false;

    relyingPartyOverrides = {
        nameIdFormats: [] as string[],
        authenticationMethods: [] as string[]
    } as RelyingPartyOverrides;

    attributeRelease = [] as string[];

    filterTarget: FilterTarget = {
        type: 'entity',
        value: ''
    };

    constructor(obj?: Partial<MetadataFilter>) {
        Object.assign(this, obj || {});
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

    get entityId(): string {
        return this.filterTarget.value;
    }

    set entityId(val: string) {
        this.filterTarget.value = val;
    }
}
