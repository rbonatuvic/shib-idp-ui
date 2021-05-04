import { Wizard } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { EntityAttributesFilter } from './entity-attributes.filter';

export const EntityAttributesFilterConfiguration: Wizard<MetadataFilter> = {
    ...EntityAttributesFilter,
    steps: [
        {
            id: 'common',
            label: 'label.target',
            index: 1,
            fields: [
                'name',
                '@type',
                'resourceId',
                'filterEnabled',
                'entityAttributesFilterTarget'
            ]
        },
        {
            id: 'options',
            label: 'label.options',
            index: 2,
            initialValues: [],
            fields: [
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
