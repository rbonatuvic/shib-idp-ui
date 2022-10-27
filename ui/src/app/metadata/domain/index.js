import { CustomAttributeDefinition } from './attribute/CustomAttributeDefinition';
import { MetadataFilterEditorTypes } from './filter';
import { MetadataProviderEditorTypes, MetadataProviderWizardTypes } from './provider';
import { DynamicHttpMetadataProviderEditor } from './provider/definition/DynamicHttpMetadataProviderDefinition';
import { FileBackedHttpMetadataProviderEditor } from './provider/definition/FileBackedHttpMetadataProviderDefinition';
import { LocalDynamicMetadataProviderEditor } from './provider/definition/LocalDynamicMetadataProviderDefinition';
import { MetadataSourceEditorTypes, MetadataSourceWizardTypes } from "./source";

export const editors = {
    ...MetadataSourceEditorTypes
};

export const wizards = {
    ...MetadataSourceWizardTypes
};

export const ProviderEditorTypes = [
    ...MetadataProviderEditorTypes
];
export const ProviderWizardTypes = [
    ...MetadataProviderWizardTypes
];
export const FilterEditorTypes = [
    ...MetadataFilterEditorTypes
];

export const AttributeEditorTypes = [
    CustomAttributeDefinition
];

export const FilterableProviders = [
    FileBackedHttpMetadataProviderEditor.type,
    DynamicHttpMetadataProviderEditor.type,
    LocalDynamicMetadataProviderEditor.type
];

export const getWizard = (type) =>
    ProviderWizardTypes.find(def => def.type === type) ||
    FilterEditorTypes.find(def => def.type === type) ||
    wizards[type];

export const getDefinition = (type) =>
    typeof type === 'string' ?
    ProviderEditorTypes.find(def => def.type === type) ||
    FilterEditorTypes.find(def => def.type === type) ||
    editors[type] : type;