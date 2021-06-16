import { EntityAttributesFilterEditor } from './definition/EntityAttributesFilterDefinition';
import { NameIDFilterEditor } from './definition/NameIdFilterDefinition';

export const MetadataFilterWizardTypes = {
    EntityAttributes: EntityAttributesFilterEditor,
    NameIDFormat: NameIDFilterEditor
};

export const MetadataFilterEditorTypes = [
    EntityAttributesFilterEditor,
    NameIDFilterEditor
];

export const MetadataFilterTypes = [
    ...MetadataFilterEditorTypes.map((t) => t.type)
];