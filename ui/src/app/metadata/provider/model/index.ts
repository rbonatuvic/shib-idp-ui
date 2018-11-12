import { FileBackedHttpMetadataProviderWizard } from './file-backed-http.provider.form';
import { FileBackedHttpMetadataProviderEditor } from './file-backed-http.provider.form';
import { LocalDynamicMetadataProviderWizard, LocalDynamicMetadataProviderEditor } from './local-dynamic.provider.form';
import { FileSystemMetadataProviderWizard, FileSystemMetadataProviderEditor } from './file-system.provider.form';

export const MetadataProviderWizardTypes = [
    FileBackedHttpMetadataProviderWizard,
    FileSystemMetadataProviderWizard,
    LocalDynamicMetadataProviderWizard
];

export const MetadataProviderEditorTypes = [
    FileBackedHttpMetadataProviderEditor,
    LocalDynamicMetadataProviderEditor,
    FileSystemMetadataProviderEditor
];

export const FilterableProviders = [
    FileBackedHttpMetadataProviderEditor.type,
    LocalDynamicMetadataProviderEditor.type
];

export * from './file-backed-http.provider.form';
export * from './provider.form';
