import { Wizard } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { removeNulls } from '../../../shared/util';
import { EntityAttributesFilter } from './entity-attributes.filter';

export const EntityAttributesFilterConfiguration: Wizard<MetadataFilter> = {
    ...EntityAttributesFilter,
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
