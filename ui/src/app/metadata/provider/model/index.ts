import { FileBackedHttpMetadataProviderWizard } from './file-backed-http.provider.form';
import { FileBackedHttpMetadataProviderEditor } from './file-backed-http.provider.form';
import { DynamicHttpMetadataProviderWizard, DynamicHttpMetadataProviderEditor } from './dynamic-http.provider.form';

export const MetadataProviderWizardTypes = [
    FileBackedHttpMetadataProviderWizard,
    DynamicHttpMetadataProviderWizard
];

export const MetadataProviderEditorTypes = [
    FileBackedHttpMetadataProviderEditor,
    DynamicHttpMetadataProviderEditor
];

export * from './file-backed-http.provider.form';
export * from './provider.form';
