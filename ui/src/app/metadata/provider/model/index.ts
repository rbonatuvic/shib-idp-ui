import { FileBackedHttpMetadataProviderWizard } from './file-backed-http.provider.form';
import { FileBackedHttpMetadataProviderEditor } from './file-backed-http.provider.form';
import { BaseMetadataProviderEditor } from './base.provider.form';

export const MetadataProviderWizardTypes = [
    FileBackedHttpMetadataProviderWizard
];

export const MetadataProviderEditorTypes = [
    FileBackedHttpMetadataProviderEditor,
    BaseMetadataProviderEditor
];

export * from './file-backed-http.provider.form';
export * from './provider.form';
