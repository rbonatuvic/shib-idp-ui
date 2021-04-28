import { EntityAttributesFilterWizard, EntityAttributesFilterEditor } from './EntityAttributesFilterDefinition';
import { NameIDFilterWizard, NameIDFilterEditor } from './NameIdFilterDefinition';

export const MetadataFilterWizardTypes = {
    EntityAttributes: EntityAttributesFilterWizard,
    NameIDFormat: NameIDFilterWizard
};

export const MetadataFilterEditorTypes = [
    EntityAttributesFilterEditor,
    NameIDFilterEditor
];

export const MetadataFilterTypes = [
    ...MetadataFilterEditorTypes.map((t) => t.type)
];