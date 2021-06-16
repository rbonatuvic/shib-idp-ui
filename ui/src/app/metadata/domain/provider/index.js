import { FileBackedHttpMetadataProviderWizard, FileBackedHttpMetadataProviderEditor } from './definition/FileBackedHttpMetadataProviderDefinition';
import { DynamicHttpMetadataProviderWizard, DynamicHttpMetadataProviderEditor } from './definition/DynamicHttpMetadataProviderDefinition';
import { LocalDynamicMetadataProviderWizard, LocalDynamicMetadataProviderEditor } from './definition/LocalDynamicMetadataProviderDefinition';
import { FileSystemMetadataProviderWizard, FileSystemMetadataProviderEditor } from './definition/FileSystemMetadataProviderDefinition';

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
