import { FileBackedHttpMetadataProviderWizard, FileBackedHttpMetadataProviderEditor } from './definition/FileBackedHttpMetadataProviderDefinition';
import { DynamicHttpMetadataProviderWizard, DynamicHttpMetadataProviderEditor } from './definition/DynamicHttpMetadataProviderDefinition';
import { LocalDynamicMetadataProviderWizard, LocalDynamicMetadataProviderEditor } from './definition/LocalDynamicMetadataProviderDefinition';
import { FileSystemMetadataProviderWizard, FileSystemMetadataProviderEditor } from './definition/FileSystemMetadataProviderDefinition';
import { ExternalMetadataProviderWizard, ExternalMetadataProviderEditor } from './definition/ExternalMetadataProviderDefinition';

export const MetadataProviderWizardTypes = [
    FileBackedHttpMetadataProviderWizard,
    DynamicHttpMetadataProviderWizard,
    FileSystemMetadataProviderWizard,
    LocalDynamicMetadataProviderWizard,
    ExternalMetadataProviderWizard,
];

export const MetadataProviderEditorTypes = [
    FileBackedHttpMetadataProviderEditor,
    DynamicHttpMetadataProviderEditor,
    LocalDynamicMetadataProviderEditor,
    FileSystemMetadataProviderEditor,
    ExternalMetadataProviderEditor,
];

export const FilterableProviders = [
    FileBackedHttpMetadataProviderEditor.type,
    DynamicHttpMetadataProviderEditor.type,
    ExternalMetadataProviderEditor.type,
];
