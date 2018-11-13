import { Wizard } from '../../../wizard/model';
import { FileBackedHttpMetadataProvider } from '../../domain/model/providers/file-backed-http-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';
import { UriValidator } from '../../../shared/validation/uri.validator';

export const FileBackedHttpMetadataProviderWizard: Wizard<FileBackedHttpMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'FileBackedHttpMetadataProvider',
    type: 'FileBackedHttpMetadataResolver',
    getValidators(namesList: string[] = [], xmlIdList: string[] = []): any {
        const validators = BaseMetadataProviderEditor.getValidators(namesList);
        validators['/xmlId'] = (value, property, form) => {
            const err = xmlIdList.indexOf(value) > -1 ? {
                code: 'INVALID_ID',
                path: `#${property.path}`,
                message: 'message.id-unique',
                params: [value]
            } : null;
            return err;
        };
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
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-common.schema.json',
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
            schema: 'assets/schema/provider/filebacked-http-reloading.schema.json',
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
            schema: 'assets/schema/provider/filebacked-http-filters.schema.json',
            fields: [
                'metadataFilters'
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 5,
            initialValues: [],
            schema: 'assets/schema/provider/metadata-provider-summary.schema.json',
            fields: [
                'enabled'
            ]
        }
    ]
};


export const FileBackedHttpMetadataProviderEditor: Wizard<FileBackedHttpMetadataProvider> = {
    ...FileBackedHttpMetadataProviderWizard,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 1,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-common.editor.schema.json',
            fields: [
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
            schema: 'assets/schema/provider/filebacked-http-reloading.schema.json',
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
            schema: 'assets/schema/provider/filebacked-http-filters.schema.json',
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
            schema: 'assets/schema/provider/filebacked-http-advanced.schema.json',
            fields: [
                'httpMetadataResolverAttributes'
            ]
        }
    ]
};
