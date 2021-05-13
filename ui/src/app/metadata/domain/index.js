import { MetadataFilterEditorTypes } from './filter';
import { MetadataProviderEditorTypes } from './provider';
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
export const FilterEditorTypes = [
    ...MetadataFilterEditorTypes
];

export const getWizard = (type) =>
    ProviderEditorTypes.find(def => def.type === type) ||
    FilterEditorTypes.find(def => def.type === type) ||
    SourceWizard;

export const getDefinition = (type) =>
    ProviderEditorTypes.find(def => def.type === type) ||
    FilterEditorTypes.find(def => def.type === type) ||
    SourceEditor;