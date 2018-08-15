import * as fromProvider from './';
import { MetadataProvider } from '../../domain/model';

describe(`provider reducer/selector functions`, () => {

    describe('getSchemaParseFn', () => {
        const schema = {
            properties: {
                foo: {
                    type: 'string'
                }
            }
        };
        const schema2 = {
            properties: {
                foo: {
                    type: 'object',
                    properties: {
                        bar: {
                            type: 'string'
                        }
                    }
                }
            }
        };
        it('should lock all properties', () => {
            expect(fromProvider.getSchemaParseFn(schema, true)).toEqual({
                ...schema,
                properties: {
                    ...schema.properties,
                    foo: {
                        ...schema.properties.foo,
                        readOnly: true
                    }
                }
            });
        });

        it('should unlock all properties', () => {
            expect(fromProvider.getSchemaParseFn(schema, false)).toEqual({
                ...schema,
                properties: {
                    ...schema.properties,
                    foo: {
                        type: 'string',
                        readOnly: false
                    }
                }
            });
        });

        it('should lock child properties properties', () => {
            expect(fromProvider.getSchemaParseFn(schema2, true)).toEqual({
                ...schema,
                properties: {
                    ...schema2.properties,
                    foo: {
                        ...schema2.properties.foo,
                        readOnly: true,
                        properties: {
                            bar: {
                                ...schema2.properties.foo.properties.bar,
                                readOnly: true
                            }
                        }
                    }
                }
            });
        });
    });

    describe('getSchemaLockedFn', () => {
        it('should return true if the step is locked', () => {
            expect(fromProvider.getSchemaLockedFn({ locked: true }, false)).toEqual(false);
        });
    });

    describe('mergeProviderOrderFn', () => {
        const providers = <MetadataProvider[]>[
            { resourceId: 'foo', name: 'foo', '@type': 'foo', enabled: true, xmlId: 'id', sortKey: 1, metadataFilters: [] },
            { resourceId: 'bar', name: 'bar', '@type': 'bar', enabled: false, xmlId: 'id2', sortKey: 2, metadataFilters: [] },
            { resourceId: 'baz', name: 'baz', '@type': 'baz', enabled: false, xmlId: 'id3', sortKey: 3, metadataFilters: [] }
        ];
        it('1 should sort the list accordingly', () => {
            let order = {resourceIds: ['bar', 'foo', 'baz']},
                ordered = fromProvider.mergeProviderOrderFn([...providers], order);
            expect(ordered.indexOf(providers[0])).toBe(1);
        });

        it('2 should sort the list accordingly', () => {
            let order = { resourceIds: ['foo', 'bar', 'baz'] },
                ordered = fromProvider.mergeProviderOrderFn(providers, order);
            expect(ordered.indexOf(providers[0])).toBe(0);
        });
    });
});
