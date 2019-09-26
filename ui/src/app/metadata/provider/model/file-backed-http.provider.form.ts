import { Wizard } from '../../../wizard/model';
import { FileBackedHttpMetadataProvider } from '../../domain/model/providers/file-backed-http-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';
import { UriValidator } from '../../../shared/validation/uri.validator';

import { metadataFilterProcessor } from './utilities';

export const FileBackedHttpMetadataProviderWizard: Wizard<FileBackedHttpMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'FileBackedHttpMetadataProvider',
    type: 'FileBackedHttpMetadataResolver',
    schemaPreprocessor: metadataFilterProcessor,
    getValidators(namesList: string[] = [], xmlIdList: string[] = []): any {
        const validators = BaseMetadataProviderEditor.getValidators(namesList, xmlIdList);
        validators['/metadataURL'] = (value, property, form) => {
            return !UriValidator.isUri(value) ? {
                code: 'INVALID_URI',
                path: `#${property.path}`,
                message: 'message.uri-valid-format',
                params: [value]
            } : null;
        };
        return validators;
    },
    schema: 'assets/schema/provider/filebacked-http.schema.json',
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'metadataURL',
                'initializeFromBackupFile',
                'backingFile',
                'backupFileInitNextRefreshDelay',
                'requireValidMetadata',
                'failFastInitialization',
                'useDefaultPredicateRegistry',
                'satisfyAnyPredicates'
            ]
        },
        {
            id: 'reloading',
            label: 'label.reloading-attributes',
            index: 3,
            initialValues: [],
            fields: [
                'reloadableMetadataResolverAttributes'
            ]
        },
        {
            id: 'plugins',
            label: 'label.metadata-filter-plugins',
            index: 4,
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
            fields: [
                'metadataFilters'
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 5,
            initialValues: [],
            fields: [
                'enabled'
            ]
        }
    ]
};


export const FileBackedHttpMetadataProviderEditor: Wizard<FileBackedHttpMetadataProvider> = {
    ...FileBackedHttpMetadataProviderWizard,
    schema: 'assets/schema/provider/filebacked-http.schema.json',
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 1,
            initialValues: [],
            fields: [
                'name',
                '@type',
                'enabled',
                'xmlId',
                'metadataURL',
                'initializeFromBackupFile',
                'backingFile',
                'backupFileInitNextRefreshDelay',
                'requireValidMetadata',
                'failFastInitialization',
                'useDefaultPredicateRegistry',
                'satisfyAnyPredicates'
            ]
        },
        {
            id: 'reloading',
            label: 'label.reloading-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'reloadableMetadataResolverAttributes'
            ]
        },
        {
            id: 'plugins',
            label: 'label.metadata-filter-plugins',
            index: 3,
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
            fields: [
                'metadataFilters'
            ]
        },
        {
            id: 'advanced',
            label: 'label.advanced-settings',
            index: 4,
            initialValues: [],
            locked: true,
            fields: [
                'httpMetadataResolverAttributes'
            ]
        }
    ]
};
