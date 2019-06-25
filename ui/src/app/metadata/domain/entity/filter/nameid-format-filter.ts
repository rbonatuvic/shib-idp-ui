import { MetadataFilter, MetadataEntity } from '../../model';
import { MetadataTypes } from '../../domain.type';
import { FilterTarget } from '../../model';

export class NameIDFormatFilterEntity implements MetadataFilter, MetadataEntity {
    createdDate?: string;
    modifiedDate?: string;
    version: string;
    resourceId: string;
    createdBy: string;

    name = '';
    filterEnabled = false;
    audId: string;
    type: string;

    nameIdFormatFilterTarget: FilterTarget = {
        type: 'ENTITY',
        value: ['']
    };

    constructor(obj?: Partial<NameIDFormatFilterEntity>) {
        Object.assign(this, { ...obj });
    }

    getId(): string {
        return this.resourceId;
    }

    getDisplayId(): string {
        return this.resourceId;
    }

    isDraft(): boolean {
        return false;
    }

    getCreationDate(): Date {
        return new Date(this.createdDate);
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

    serialize(): any {
        return {
            nameIdFormatFilterTarget: this.nameIdFormatFilterTarget,
            filterEnabled: this.filterEnabled,
            name: this.name,
            '@type': 'EntityAttributes'
        };
    }
}
