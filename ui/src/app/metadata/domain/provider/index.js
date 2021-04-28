import { FileBackedHttpMetadataProviderWizard, FileBackedHttpMetadataProviderEditor } from './FileBackedHttpMetadataProviderDefinition';
import { DynamicHttpMetadataProviderWizard, DynamicHttpMetadataProviderEditor } from './DynamicHttpMetadataProviderDefinition';
import { LocalDynamicMetadataProviderWizard, LocalDynamicMetadataProviderEditor } from './LocalDynamicMetadataProviderDefinition';
import { FileSystemMetadataProviderWizard, FileSystemMetadataProviderEditor } from './FileSystemMetadataProviderDefinition';

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
