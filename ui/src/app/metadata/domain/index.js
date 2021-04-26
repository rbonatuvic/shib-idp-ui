import { SourceEditor } from "./source/SourceDefinition";

export const editors = {
    source: SourceEditor
};

export const ProviderEditorTypes = [];
export const FilterEditorTypes = [];


export const getDefinition = (type) =>
    ProviderEditorTypes.find(def => def.type === type) ||
    FilterEditorTypes.find(def => def.type === type) ||
    SourceEditor;