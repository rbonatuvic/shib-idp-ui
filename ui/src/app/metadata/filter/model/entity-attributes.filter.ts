import { FormDefinition } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';

export const EntityAttributesFilter: FormDefinition<MetadataFilter> = {
    label: 'EntityAttributes',
    type: 'EntityAttributes',
    schema: '/api/ui/EntityAttributesFilters',
    getValidators(): any {
        const validators = {};
        return validators;
    },
    parser: (changes: any): MetadataFilter => changes,
    formatter: (changes: MetadataFilter): any => changes
};
