import { FileBackedHttpMetadataProviderWizard } from './file-backed-http.provider.form';
import { FileBackedHttpMetadataProviderEditor } from './file-backed-http.provider.form';
import { DynamicHttpMetadataProviderWizard, DynamicHttpMetadataProviderEditor } from './dynamic-http.provider.form';
import { LocalDynamicMetadataProviderWizard, LocalDynamicMetadataProviderEditor } from './local-dynamic.provider.form';
import { FileSystemMetadataProviderWizard, FileSystemMetadataProviderEditor } from './file-system.provider.form';

export const MetadataProviderWizardTypes = [
    FileBackedHttpMetadataProviderWizard,
    DynamicHttpMetadataProviderWizard,
    FileSystemMetadataProviderWizard,
    LocalDynamicMetadataProviderWizard
];

export const MetadataProviderEditorTypes = [
    FileBackedHttpMetadataProviderEditor,
    DynamicHttpMetadataProviderEditor,
    LocalDynamicMetadataProviderEditor,
    FileSystemMetadataProviderEditor
];

export const FilterableProviders = [
    FileBackedHttpMetadataProviderEditor.type,
    DynamicHttpMetadataProviderEditor.type,
    LocalDynamicMetadataProviderEditor.type
];

export * from './file-backed-http.provider.form';
export * from './provider.form';
