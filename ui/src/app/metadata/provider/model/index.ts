import { FileBackedHttpMetadataProviderWizard } from './file-backed-http.provider.form';
import { FileBackedHttpMetadataProviderEditor } from './file-backed-http.provider.form';
import { FileSystemMetadataProviderWizard, FileSystemMetadataProviderEditor } from './file-system.provider.form';

export const MetadataProviderWizardTypes = [
    FileBackedHttpMetadataProviderWizard,
    FileSystemMetadataProviderWizard
];

export const MetadataProviderEditorTypes = [
    FileBackedHttpMetadataProviderEditor,
    FileSystemMetadataProviderEditor
];

export const FilterableProviders = [
    FileBackedHttpMetadataProviderEditor.type
];

export * from './file-backed-http.provider.form';
export * from './provider.form';
