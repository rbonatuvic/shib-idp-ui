import { MetadataFilter, MetadataEntity, RelyingPartyOverrides } from '../../model';
import { MetadataTypes } from '../../domain.type';
import { FilterTarget } from '../../model';

export class EntityAttributesFilter implements MetadataFilter, MetadataEntity {
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

    getId(): string {
        return this.entityId;
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
        return MetadataTypes.FILTER;
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
