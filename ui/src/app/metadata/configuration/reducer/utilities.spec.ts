import {
    getConfigurationSectionsFn,
    getLimitedPropertiesFn,
    assignValueToProperties
} from './utilities';

import { SCHEMA as schema } from '../../../../testing/form-schema.stub';
import { MockMetadataWizard } from '../../../../testing/mockMetadataWizard';

describe('config reducer utilities', () => {

    const model = {
        name: 'foo',
        serviceEnabled: true,
        foo: {
            bar: 'bar',
            baz: 'baz'
        },
        list: [
            'super',
            'cool'
        ]
    };

    const props = [
        {
            id: 'name',
            items: null,
            name: 'label.metadata-provider-name-dashboard-display-only',
            properties: [],
            type: 'string',
            value: null,
            widget: { id: 'string', help: 'message.must-be-unique' }
        },
        {
            id: 'serviceEnabled',
            items: null,
            name: 'serviceEnabled',
            properties: [],
            type: 'string',
            value: null,
            widget: { id: 'select', disabled: true }
        },
        {
            id: 'foo',
            items: null,
            name: 'foo',
            type: 'object',
            properties: [
                {
                    id: 'bar',
                    name: 'bar',
                    type: 'string',
                    properties: []
                },
                {
                    id: 'baz',
                    name: 'baz',
                    type: 'string',
                    properties: []
                }
            ]
        },
        {
            id: 'list',
            name: 'list',
            type: 'array',
            items: {
                type: 'string'
            },
            widget: {
                id: 'datalist',
                data: [
                    { key: 'super', label: 'super' },
                    { key: 'cool', label: 'cool' },
                    { key: 'notcool', label: 'notcool' }
                ]
            }
        }
    ];

    const definition = MockMetadataWizard;

    describe('assignValueToProperties function', () => {
        it('should assign appropriate values to the given schema properties', () => {
            const assigned = assignValueToProperties([model], props, definition);
            expect(assigned[0].value).toEqual(['foo']);
            expect(assigned[1].value).toEqual([true]);
        });

        it('should assign differences when passed multiple models', () => {
            const assigned = assignValueToProperties([model, {
                ...model,
                name: 'bar',
                list: [
                    'super',
                    'notcool'
                ]
            }], props, definition);
            expect(assigned[0].differences).toBe(true);
        });
    });

    describe('getLimitedPropertiesFn function', () => {
        it('should filter properties without differences', () => {
            const assigned = assignValueToProperties([model, {
                ...model,
                name: 'bar'
            }], props, definition);
            expect(getLimitedPropertiesFn(assigned).length).toBe(1);
        });
    });

    describe('getConfigurationSectionsFn', () => {
        it('should parse the schema, definition, and model into a MetadataConfiguration', () => {
            const config = getConfigurationSectionsFn([model], definition, schema);
            expect(config.sections).toBeDefined();
        });
    });
});
