import { MetadataFilter, RelyingPartyOverrides } from '../model/metadata-filter';
import { DomainEntityKinds } from '../domain.type';
import { FilterTarget } from '../model/filter-target';

export class EntityAttributesFilter implements MetadataFilter {
    createdDate?: string;
    modifiedDate?: string;
    version: string;
    resourceId: string;

    name = '';
    filterEnabled = false;
    audId: string;
    type: string;

    relyingPartyOverrides = {
        nameIdFormats: [] as string[],
        authenticationMethods: [] as string[]
    } as RelyingPartyOverrides;

    attributeRelease = [] as string[];

    entityAttributesFilterTarget: FilterTarget = {
        type: 'ENTITY',
        value: ['']
    };

    constructor(obj?: Partial<EntityAttributesFilter>) {
        Object.assign(this, { ...obj });
    }

    get id(): string {
        return this.resourceId;
    }

    set id(id: string) {
        this.resourceId = id;
    }

    get enabled(): boolean {
        return this.filterEnabled;
    }

    get kind(): string {
        return DomainEntityKinds.filter;
    }

    get entityId(): string {
        return this.entityAttributesFilterTarget.value[0];
    }

    set entityId(val: string) {
        this.entityAttributesFilterTarget.value[0] = val;
    }

    serialize(): any {
        return {
            attributeRelease: this.attributeRelease,
            relyingPartyOverrides: this.relyingPartyOverrides,
            entityAttributesFilterTarget: { ...this.entityAttributesFilterTarget },
            filterEnabled: this.filterEnabled,
            name: this.name,
            '@type': 'EntityAttributes'
        };
    }
}
