import { Wizard } from '../../../wizard/model';
import { MetadataFilter } from '../../domain/model';
import { NameIDFilter } from './nameid.filter';

export const NameIDFilterConfiguration: Wizard<MetadataFilter> = {
    ...NameIDFilter,
    steps: [
        {
            id: 'common',
            label: 'label.target',
            index: 1,
            fields: [
                'name',
                'filterEnabled',
                '@type',
                'resourceId',
                'nameIdFormatFilterTarget'
            ]
        },
        {
            id: 'options',
            label: 'label.options',
            index: 1,
            initialValues: [],
            fields: [
                'removeExistingFormats',
                'formats'
            ]
        }
    ]
};
