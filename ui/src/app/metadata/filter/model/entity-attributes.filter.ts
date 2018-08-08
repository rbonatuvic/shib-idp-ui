import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';

export const EntityAttributesFilter: FormDefinition<MetadataFilter> = {
    label: 'EntityAttributes',
    type: 'EntityAttributes',
    schema: 'assets/schema/filter/entity-attributes.schema.json',
    getValidators(): any {
        const validators = {};
        return validators;
    },
    translate: {
        parser: (changes: any): MetadataFilter => changes,
        formatter: (changes: MetadataFilter): any => changes
    }
};
