import { CustomAttributeDefinition } from './attribute/CustomAttributeDefinition';
import { MetadataFilterEditorTypes } from './filter';
import { MetadataProviderEditorTypes, MetadataProviderWizardTypes } from './provider';
import { DynamicHttpMetadataProviderEditor } from './provider/DynamicHttpMetadataProviderDefinition';
import { FileBackedHttpMetadataProviderEditor } from './provider/FileBackedHttpMetadataProviderDefinition';
import { LocalDynamicMetadataProviderEditor } from './provider/LocalDynamicMetadataProviderDefinition';
import { SourceEditor, SourceWizard } from "./source/SourceDefinition";

export const editors = {
    source: SourceEditor
};

export const wizards = {
    source: SourceWizard
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
    SourceWizard;

export const getDefinition = (type) =>
    typeof type === 'string' ?
    ProviderEditorTypes.find(def => def.type === type) ||
    FilterEditorTypes.find(def => def.type === type) ||
    SourceEditor : type;