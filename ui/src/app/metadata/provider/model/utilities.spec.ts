import { metadataFilterProcessor } from './utilities';

describe('provider model utilities', () => {
    describe('metadata filter processor function', () => {
        it('should return null if no schema provided', () => {
            expect(metadataFilterProcessor(null)).toBe(null);
        });

        it('should return the schema if no properties are detected', () => {
            const schema = {};
            expect(metadataFilterProcessor(schema)).toBe(schema);
        });

        it('should return the schema if no metadataFilters property exists in the schema', () => {
            const schema = { properties: { foo: 'bar' } };
            expect(metadataFilterProcessor(schema)).toBe(schema);
        });

        it('should turn the filters into an object if provided ', () => {
            const schema = { properties: { metadataFilters: {
                type: 'array',
                items: [
                    {
                        $id: 'foo',
                        type: 'string'
                    }
                ]
            } } };
            const processed = metadataFilterProcessor(schema);
            expect(processed.properties.metadataFilters.properties.foo.type).toBe('string');
        });
    });
});
