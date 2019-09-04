import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { NameIDFormatFilterEntity } from '../../domain/entity/filter/nameid-format-filter';
import { RegexValidator } from '../../../shared/validation/regex.validator';

import { memoize } from '../../../shared/memo';

const checkRegex = memoize(RegexValidator.isValidRegex);

export const NameIDFilter: FormDefinition<MetadataFilter> = {
    label: 'NameIDFormat',
    type: 'NameIDFormat',
    schema: '/api/ui/NameIdFormatFilter',
    getEntity(filter: MetadataFilter): NameIDFormatFilterEntity {
        return new NameIDFormatFilterEntity(filter);
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
            },
            '/nameIdFormatFilterTarget': (value, property, form) => {
                if (!form || !form.value || !form.value.nameIdFormatFilterTarget ||
                    form.value.nameIdFormatFilterTarget.nameIdFormatFilterTargetType !== 'REGEX') {
                    return null;
                }
                return checkRegex(value.value[0]) ? null : {
                    code: 'INVALID_REGEX',
                    path: `#${property.path}`,
                    message: 'message.invalid-regex-pattern',
                    params: [value.value[0]]
                };
            }
        };
        return validators;
    },
    parser: (changes: any): MetadataFilter => changes,
    formatter: (changes: MetadataFilter): any => changes
};
