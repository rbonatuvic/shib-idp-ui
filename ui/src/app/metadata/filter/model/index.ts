import { EntityAttributesFilter } from './entity-attributes.filter';
import { NameIDFilter } from './nameid.filter';
import { EntityAttributesFilterConfiguration } from './entity-attributes-configuration.filter';
import { NameIDFilterConfiguration } from './nameid-configuration.filter';

export const MetadataFilterTypes = {
    EntityAttributes: EntityAttributesFilterConfiguration,
    NameIDFormat: NameIDFilter
};

export const MetadataFilterEditorTypes = [
    EntityAttributesFilterConfiguration,
    NameIDFilterConfiguration
];

export * from './entity-attributes.filter';
export * from './nameid.filter';
