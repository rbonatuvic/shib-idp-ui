import { FileBackedHttpMetadataProviderWizard } from './file-backed-http.provider.form';
import { FileBackedHttpMetadataProviderEditor } from './file-backed-http.provider.form';
import { LocalDynamicMetadataProviderWizard, LocalDynamicMetadataProviderEditor } from './local-dynamic.provider.form';

export const MetadataProviderWizardTypes = [
    FileBackedHttpMetadataProviderWizard,
    LocalDynamicMetadataProviderWizard
];

export const MetadataProviderEditorTypes = [
    FileBackedHttpMetadataProviderEditor,
    LocalDynamicMetadataProviderEditor
];

export * from './file-backed-http.provider.form';
export * from './provider.form';
