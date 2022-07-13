import defaultsDeep from 'lodash/defaultsDeep';
import { BaseProviderDefinition, HttpMetadataResolverAttributesSchema, MetadataFilterPluginsSchema } from './BaseProviderDefinition';

import { DurationOptions, MaxRefreshOptions, MinRefreshOptions } from '../../data';
import { BASE_PATH } from '../../../../App.constant';

export const FileBackedHttpMetadataProviderWizard = {
    ...BaseProviderDefinition,
    label: 'FileBackedHttpMetadataProvider',
    type: 'FileBackedHttpMetadataResolver',
    schema: `${BASE_PATH}assets/schema/provider/filebacked-http.schema.json`,
    validator: (data = [], current = { resourceId: null }, group, translator) => {
        const base = BaseProviderDefinition.validator(data, current, group);

        const pattern = group?.validationRegex ? new RegExp(group?.validationRegex) : null;

        return (formData, errors) => {
            const errorList = base(formData, errors);
            if (formData?.metadataURL) {
                if (pattern && !pattern.test(formData?.metadataURL)) {
                    errors?.metadataURL?.addError(translator('message.group-pattern-fail', { regex: group?.validationRegex }));
                }
            }

            return errorList;
        }
    },
    steps: [
        ...BaseProviderDefinition.steps,
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
            fields: []
        }
    ],
    uiSchema: defaultsDeep({
        layout: {
            groups: [
                {
                    size: 8,
                    classNames: 'bg-light border rounded px-4 pt-4 pb-3 mb-4',
                    fields: [
                        'name',
                        '@type'
                    ]
                },
                {
                    size: 8,
                    fields: [
                        'xmlId',
                        'metadataURL',
                        'initializeFromBackupFile',
                        'backingFile',
                        'backupFileInitNextRefreshDelay',
                        'requireValidMetadata',
                        'failFastInitialization',
                        'useDefaultPredicateRegistry',
                        'satisfyAnyPredicates',
                    ]
                },
                {
                    size: 8,
                    fields: [
                        'reloadableMetadataResolverAttributes'
                    ],
                },
                {
                    size: 8,
                    fields: [
                        'metadataFilters'
                    ],
                },
                {
                    size: 8,
                    fields: [
                        'httpMetadataResolverAttributes'
                    ]
                }
            ]
        },
        initializeFromBackupFile: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        backupFileInitNextRefreshDelay: {
            'ui:widget': 'OptionWidget',
            options: DurationOptions,
            'ui:placeholder': 'label.duration'
        },
        requireValidMetadata: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        useDefaultPredicateRegistry: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        satisfyAnyPredicates: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        failFastInitialization: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        reloadableMetadataResolverAttributes: {
            minRefreshDelay: {
                'ui:widget': 'OptionWidget',
                options: MinRefreshOptions,
                'ui:placeholder': 'label.duration'
            },
            maxRefreshDelay: {
                'ui:widget': 'OptionWidget',
                options: MaxRefreshOptions,
                'ui:placeholder': 'label.duration'
            },
            refreshDelayFactor: {
                'ui:widget': 'updown',
                'ui:options': {
                    help: 'message.real-number',
                    step: 0.001
                },
                'ui:placeholder': 'label.real-number'
            }
        },
        metadataFilters: MetadataFilterPluginsSchema,
        httpMetadataResolverAttributes: HttpMetadataResolverAttributesSchema
    }, BaseProviderDefinition.uiSchema)
};


export const FileBackedHttpMetadataProviderEditor = {
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
                'xmlId',
                'metadataURL',
                'initializeFromBackupFile',
                'backingFile',
                'backupFileInitNextRefreshDelay',
                'requireValidMetadata',
                'failFastInitialization',
                'useDefaultPredicateRegistry',
                'satisfyAnyPredicates',
                'enabled'
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
    ],
    uiSchema: defaultsDeep({
        '@type': {
            'ui:readonly': true
        }
    }, FileBackedHttpMetadataProviderWizard.uiSchema)
};
