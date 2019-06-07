import { getStepProperties, getDefinition, getPropertyItemSchema, getStepProperty } from './configuration';
import * as utils from './configuration';
import { SCHEMA } from '../../../../testing/form-schema.stub';

describe('domain utility functions', () => {
    describe('getStepProperties function', () => {
        it('should return an empty array of schema or schema.properties is not defined', () => {
            expect(getStepProperties(null, {})).toEqual([]);
            expect(getStepProperties({}, {})).toEqual([]);
        });

        it('should return a formatted list of properties', () => {
            expect(getStepProperties(SCHEMA, {}).length).toBe(2);
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
            expect(getDefinition('/foo/bar', {bar: definition})).toBe(definition);
        });
    });

    describe('getPropertyItemSchema method', () => {
        it('should return null if no items are provided', () => {
            expect(getPropertyItemSchema(null, SCHEMA.definitions)).toBeNull();
        });
        it('should retrieve the definitions from the items schema', () => {
            expect(getPropertyItemSchema({$ref: 'description'}, SCHEMA.definitions)).toBe(SCHEMA.definitions.description);
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
});

