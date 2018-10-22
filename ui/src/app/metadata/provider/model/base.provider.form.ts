import { Wizard } from '../../../wizard/model';
import { BaseMetadataProvider } from '../../domain/model/providers';
import { UriValidator } from '../../../shared/validation/uri.validator';

export const BaseMetadataProviderEditor: Wizard<BaseMetadataProvider> = {
    label: 'BaseMetadataProvider',
    type: 'BaseMetadataResolver',
    getValidators(namesList: string[]): any {
        const validators = {
            '/': (value, property, form_current) => {
                let errors;
                // iterate all customer
                Object.keys(value).forEach((key) => {
                    const item = value[key];
                    const validatorKey = `/${key}`;
                    const validator = validators.hasOwnProperty(validatorKey) ? validators[validatorKey] : null;
                    const error = validator ? validator(item, { path: `/${key}` }, form_current) : null;
                    if (error) {
                        errors = errors || [];
                        errors.push(error);
                    }
                });
                return errors;
            },
            '/name': (value, property, form) => {
                const err = namesList.indexOf(value) > -1 ? {
                    code: 'INVALID_NAME',
                    path: `#${property.path}`,
                    message: 'message.name-must-be-unique',
                    params: [value]
                } : null;
                return err;
            },
            '/metadataURL': (value, property, form) => {
                return !UriValidator.isUri(value) ? {
                    code: 'INVALID_URI',
                    path: `#${property.path}`,
                    message: 'message.uri-valid-format',
                    params: [value]
                } : null;
            }
        };
        return validators;
    },
    parser: (changes: any): BaseMetadataProvider => (changes.metadataFilters ? ({
        ...changes,
        metadataFilters: [
            ...Object.keys(changes.metadataFilters).reduce((collection, filterName) => ([
                ...collection,
                {
                    ...changes.metadataFilters[filterName],
                    '@type': filterName
                }
            ]), [])
        ]
    }) : changes),
    formatter: (changes: BaseMetadataProvider): any => (changes.metadataFilters ? ({
        ...changes,
        metadataFilters: {
            ...(changes.metadataFilters || []).reduce((collection, filter) => ({
                ...collection,
                [filter['@type']]: filter
            }), {})
        }
    }) : changes),
    steps: []
};
