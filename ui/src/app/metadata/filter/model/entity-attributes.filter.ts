import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { removeNulls } from '../../../shared/util';
import { EntityAttributesFilterEntity } from '../../domain/entity';
import { RegexValidator } from '../../../shared/validation/regex.validator';
import { getFilterNames } from '../reducer';
import { memoize } from '../../../shared/memo';
import API_BASE_PATH from '../../../app.constant';

const checkRegex = memoize(RegexValidator.isValidRegex);

export const EntityAttributesFilter: FormDefinition<MetadataFilter> = {
    label: 'EntityAttributes',
    type: 'EntityAttributes',
    schema: `${API_BASE_PATH}/ui/EntityAttributesFilters`,
    getEntity(filter: MetadataFilter): EntityAttributesFilterEntity {
        return new EntityAttributesFilterEntity(filter);
    },
    validatorParams: [getFilterNames],
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
                    if (error && error.invalidate) {
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
                    params: [value],
                    invalidate: true
                } : null;
                return err;
            },
            '/relyingPartyOverrides': (value, property, form) => {
                if (!value.signAssertion && value.dontSignResponse) {
                    return {
                        code: 'INVALID_SIGNING',
                        path: `#${property.path}`,
                        message: 'message.invalid-signing',
                        params: [value],
                        invalidate: false
                    };
                }
                return null;
            },
            '/entityAttributesFilterTarget': (value, property, form) => {
                if (!form || !form.value || !form.value.entityAttributesFilterTarget ||
                    form.value.entityAttributesFilterTarget.entityAttributesFilterTargetType !== 'REGEX') {
                    return null;
                }
                return checkRegex(value.value[0]) ? null : {
                    code: 'INVALID_REGEX',
                    path: `#${property.path}`,
                    message: 'message.invalid-regex-pattern',
                    params: [value.value[0]],
                    invalidate: true
                };
            },
        };
        return validators;
    },
    parser: (changes: any): MetadataFilter => {
        return {
            ...changes,
            relyingPartyOverrides: removeNulls(new EntityAttributesFilterEntity(changes).relyingPartyOverrides)
        };
    },
    formatter: (changes: MetadataFilter): any => changes
};
