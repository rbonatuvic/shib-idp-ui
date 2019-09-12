import {
    getConfigurationSectionsFn,
    getConfigurationModelNameFn,
    getConfigurationModelEnabledFn,
    assignValueToProperties,
    getLimitedPropertiesFn,
    getConfigurationModelTypeFn,
    getSelectedVersionNumberFn,
    getSelectedIsCurrentFn
} from './index';
import { SCHEMA as schema } from '../../../../testing/form-schema.stub';
import { Metadata } from '../../domain/domain.type';
import { MockMetadataWizard } from '../../../../testing/mockMetadataWizard';

describe('Configuration Reducer', () => {
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

    describe('getConfigurationSectionsFn', () => {
        it('should parse the schema, definition, and model into a MetadataConfiguration', () => {
            const config = getConfigurationSectionsFn([model], definition, schema);
            expect(config.sections).toBeDefined();
        });
    });

    describe('getConfigurationModelNameFn function', () => {
        it('should return the name attribute', () => {
            expect(getConfigurationModelNameFn({ serviceProviderName: 'foo' } as Metadata)).toBe('foo');
            expect(getConfigurationModelNameFn({ name: 'bar' } as Metadata)).toBe('bar');
            expect(getConfigurationModelNameFn(null)).toBe(false);
        });
    });

    describe('getConfigurationModelEnabledFn function', () => {
        it('should return the name attribute', () => {
            expect(getConfigurationModelEnabledFn({ serviceEnabled: true } as Metadata)).toBe(true);
            expect(getConfigurationModelEnabledFn({ enabled: true } as Metadata)).toBe(true);
            expect(getConfigurationModelEnabledFn(null)).toBe(false);
        });
    });

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

    describe('getConfigurationModelTypeFn function ', () => {
        it('should return provider type if the object has an @type property', () => {
            const md = { '@type': 'FilebackedHttpMetadataResolver' } as Metadata;
            expect(getConfigurationModelTypeFn(md)).toBe('FilebackedHttpMetadataResolver');
        });
        it('should return resolver if no type is detected', () => {
            const md = { serviceEnabled: true } as Metadata;
            expect(getConfigurationModelTypeFn(md)).toBe('resolver');
        });
    });

    describe('getSelectedVersionNumberFn function ', () => {
        it('should return the selected version by id', () => {
            const versions = [ { id: 'foo' }, { id: 'bar' } ];
            const id = 'foo';
            expect(getSelectedVersionNumberFn(versions, id)).toBe(1);
        });
    });

    describe('getSelectedIsCurrentFn function ', () => {
        it('should return a boolean of whether the selected version is the most current version', () => {
            const versions = [{ id: 'foo' }, { id: 'bar' }];
            const id = 'foo';
            expect(getSelectedIsCurrentFn(versions[0], versions)).toBe(true);
            expect(getSelectedIsCurrentFn(versions[1], versions)).toBe(false);
        });
    });
});
