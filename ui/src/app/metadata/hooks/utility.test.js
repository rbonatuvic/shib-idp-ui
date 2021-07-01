import SCHEMA from '../../../testing/simpleSchema';

import {
    getConfigurationSections,
    getLimitedProperties,
    assignValueToProperties,
    getStepProperties,
    getDefinition,
    getPropertyItemSchema,
    getStepProperty
} from './utility';

import { SCHEMA as formSchema } from '../../../testing/form-schema';
import { MockMetadataWizard } from '../../../testing/mockMetadataWizard';

describe('domain utility functions', () => {
    describe('getStepProperties function', () => {
        it('should return an empty array of schema or schema.properties is not defined', () => {
            expect(getStepProperties(null, {})).toEqual([]);
            expect(getStepProperties({}, {})).toEqual([]);
        });

        it('should return a formatted list of properties', () => {
            expect(getStepProperties(SCHEMA, {}).length).toBe(4);
        });
    });

    describe('getDefinitions method', () => {
        it('should retrieve the definitions from the json schema', () => {
            const definition = {
                id: 'foo',
                title: 'bar',
                description: 'baz',
                type: 'string'
            };
            expect(getDefinition('/foo/bar', { bar: definition })).toBe(definition);
        });
    });

    describe('getPropertyItemSchema method', () => {
        it('should return null if no items are provided', () => {
            expect(getPropertyItemSchema(null, SCHEMA.definitions)).toBeNull();
        });
        it('should retrieve the definitions from the items schema', () => {
            expect(getPropertyItemSchema({ $ref: 'description' }, SCHEMA.definitions)).toBe(SCHEMA.definitions.description);
        });
        it('should return the item itself if no $ref', () => {
            let item = {};
            expect(getPropertyItemSchema(item, SCHEMA.definitions)).toBe(item);
        });
    });

    describe('getStepProperty method', () => {
        const model = {
            name: 'foo',
            type: 'bar',
            description: 'baz'
        };
        it('should return null if no items are provided', () => {
            expect(getStepProperty(null, null, SCHEMA.definitions)).toBeNull();
        });

        it('should retrieve the property $ref definition if available', () => {
            const property = getStepProperty(
                { $ref: 'description' },
                model,
                SCHEMA.definitions
            );
            expect(property.type).toBe('string');
        });
    });

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
                expect(getLimitedProperties(assigned).length).toBe(1);
            });
        });

        describe('getConfigurationSections', () => {
            it('should parse the schema, definition, and model into a MetadataConfiguration', () => {
                const config = getConfigurationSections([model], definition, formSchema);
                expect(config.sections).toBeDefined();
            });
        });
    });

});

