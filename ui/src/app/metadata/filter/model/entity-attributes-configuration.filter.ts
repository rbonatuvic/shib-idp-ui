import { Wizard } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { removeNulls } from '../../../shared/util';
import { EntityAttributesFilterEntity } from '../../domain/entity';

export const EntityAttributesFilterConfiguration: Wizard<MetadataFilter> = {
    label: 'EntityAttributes',
    type: 'EntityAttributes',
    schema: '/api/ui/EntityAttributesFilters',
    getEntity(filter: MetadataFilter): EntityAttributesFilterEntity {
        return new EntityAttributesFilterEntity(filter);
    },
    getValidators(namesList: string[] = []): any {
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
            }
        };
        return validators;
    },
    parser: (changes: any): MetadataFilter => {
        return {
            ...changes,
            relyingPartyOverrides: removeNulls(new EntityAttributesFilterEntity(changes).relyingPartyOverrides)
        };
    },
    formatter: (changes: MetadataFilter): any => changes,
    steps: [
        {
            id: 'target',
            label: 'label.target',
            index: 1,
            fields: [
                'entityAttributesFilterTarget'
            ]
        },
        {
            id: 'options',
            label: 'label.options',
            index: 2,
            initialValues: [],
            fields: [
                'name',
                '@type',
                'resourceId',
                'version',
                'filterEnabled',
                'relyingPartyOverrides'
            ]
        },
        {
            id: 'attributes',
            label: 'label.attributes',
            index: 3,
            fields: [
                'attributeRelease'
            ]
        }
    ]
};
