import * as fromProvider from './';
import { MetadataProvider } from '../../domain/model';
import { mergeOrderFn } from '../../domain/domain.util';

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
});
