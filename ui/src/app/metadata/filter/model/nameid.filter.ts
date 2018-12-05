import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';

export const NameIDFilter: FormDefinition<MetadataFilter> = {
    label: 'NameIDFilter',
    type: 'NameIDFormat',
    schema: 'assets/schema/filter/nameid.schema.json',
    getValidators(): any {
        const validators = {};
        return validators;
    },
    parser: (changes: any): MetadataFilter => changes,
    formatter: (changes: MetadataFilter): any => changes
};
