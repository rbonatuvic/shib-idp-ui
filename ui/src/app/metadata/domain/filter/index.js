import { EntityAttributesFilterEditor } from './definition/EntityAttributesFilterDefinition';
import { NameIDFilterEditor } from './definition/NameIdFilterDefinition';
import { AlgorithmFilterEditor } from './definition/AlgorithmFilterDefinition';

export const MetadataFilterWizardTypes = {
    EntityAttributes: EntityAttributesFilterEditor,
    NameIDFormat: NameIDFilterEditor,
    Algorithm: AlgorithmFilterEditor,
};

export const MetadataFilterEditorTypes = [
    EntityAttributesFilterEditor,
    NameIDFilterEditor,
    AlgorithmFilterEditor,
];

export const MetadataFilterTypes = [
    ...MetadataFilterEditorTypes.map((t) => t.type)
];