import { FileBackedHttpMetadataProviderWizard } from './file-backed-http.provider.form';
import { FileBackedHttpMetadataProviderEditor } from './file-backed-http.provider.form';
import { DynamicHttpMetadataProviderWizard, DynamicHttpMetadataProviderEditor } from './dynamic-http.provider.form';
import { FileSystemMetadataProviderWizard } from './file-system.provider.form';

export const MetadataProviderWizardTypes = [
    FileBackedHttpMetadataProviderWizard,
    DynamicHttpMetadataProviderWizard,
    FileBackedHttpMetadataProviderWizard,
    FileSystemMetadataProviderWizard
];

export const MetadataProviderEditorTypes = [
    FileBackedHttpMetadataProviderEditor,
    DynamicHttpMetadataProviderEditor,
    FileBackedHttpMetadataProviderEditor
];

export const FilterableProviders = [
    FileBackedHttpMetadataProviderEditor.type,
    DynamicHttpMetadataProviderEditor.type
];

export * from './file-backed-http.provider.form';
export * from './provider.form';
