import { Wizard } from '../../../wizard/model';
import { BaseMetadataProvider } from '../../domain/model/providers';
import { filterTypeFn } from '../../filter/reducer';
import { getFilteredProviderNames, getFilteredProviderXmlIds } from '../reducer';

export const BaseMetadataProviderEditor: Wizard<BaseMetadataProvider> = {
    label: 'BaseMetadataProvider',
    type: 'BaseMetadataResolver',
    schema: '',
    validatorParams: [getFilteredProviderNames, getFilteredProviderXmlIds],
    getValidators(namesList: string[], xmlIdList: string[]): any {
        const validators = {
            '/': (value, property, form_current) => {
                let errors;
                Object.keys(value).forEach((key) => {
                    const item = value[key];
                    const validatorKey = `/${key}`;
                    const validator = validators.hasOwnProperty(validatorKey) ? validators[validatorKey] : null;
                    const error = validator ? validator(item, property.properties[key], form_current) : null;
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
            '/xmlId': (value, property, form) => {
                const err = xmlIdList.indexOf(value) > -1 ? {
                    code: 'INVALID_ID',
                    path: `#${property.path}`,
                    message: 'message.id-unique',
                    params: [value]
                } : null;
                return err;
            }
        };
        return validators;
    },
    parser: (changes: any, provider: any): BaseMetadataProvider => {
        if (!changes.metadataFilters) {
            return changes;
        }
        const staticFilterTypes = Object.keys(changes.metadataFilters);
        const filterList = filterTypeFn(provider.metadataFilters);
        return {
            ...changes,
            metadataFilters: [
                ...staticFilterTypes.reduce((collection, filterName) => ([
                    ...collection,
                    {
                        ...changes.metadataFilters[filterName],
                        '@type': filterName
                    }
                ]), []),
                ...filterList
            ]
        };
    },
    formatter: (changes: BaseMetadataProvider): any => {
        if (!changes.metadataFilters) {
            return changes;
        }
        return {
            ...changes,
            metadataFilters: {
                ...(changes.metadataFilters || []).reduce((collection, filter) => ({
                    ...collection,
                    [filter['@type']]: filter
                }), {})
            }
        };
    },
    steps: []
};
