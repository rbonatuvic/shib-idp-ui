import { EntityAttributesFilter } from './entity-attributes.filter';
import { NameIDFilter } from './nameid.filter';

export const MetadataFilterTypes = {
    EntityAttributes: EntityAttributesFilter,
    NameIDFormat: NameIDFilter
};

export * from './entity-attributes.filter';
export * from './nameid.filter';
