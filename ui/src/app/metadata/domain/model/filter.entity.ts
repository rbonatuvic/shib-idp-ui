import { MetadataFilter, RelyingPartyOverrides } from '../model';
import { MetadataTypes } from '../domain.type';
import { FilterTarget } from '../model';
import { MetadataEntity } from '../model';

export class Filter implements MetadataFilter, MetadataEntity {
    id = '';
    createdDate?: string;
    modifiedDate?: string;
    version: string;

    filterName = '';
    filterEnabled = false;

    relyingPartyOverrides = {
        nameIdFormats: [] as string[],
        authenticationMethods: [] as string[]
    } as RelyingPartyOverrides;

    attributeRelease = [] as string[];

    filterTarget: FilterTarget = {
        type: 'ENTITY',
        value: ['']
    };

    constructor(obj?: Partial<MetadataFilter>) {
        Object.assign(this, { ...obj });
    }

    get name(): string {
        return this.filterName;
    }

    get enabled(): boolean {
        return this.filterEnabled;
    }

    get type(): string {
        return MetadataTypes.FILTER;
    }

    get entityId(): string {
        return this.filterTarget.value[0];
    }

    set entityId(val: string) {
        this.filterTarget.value[0] = val;
    }

    serialize(): any {
        return {
            attributeRelease: this.attributeRelease,
            relyingPartyOverrides: this.relyingPartyOverrides,
            filterTarget: { ...this.filterTarget },
            filterEnabled: this.filterEnabled,
            filterName: this.filterName
        };
    }
}
