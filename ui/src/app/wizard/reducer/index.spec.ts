import * as selectors from './';
import { FileBackedHttpMetadataProviderWizard } from '../../metadata/provider/model';

describe('wizard index selectors', () => {
    describe('getSchema method', () => {
        it('should return the schema by index name', () => {
            expect(
                selectors.getSchemaPath('common', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps[0].schema);
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getSchemaPath('common', null)
            ).toBeFalsy();
        });
    });
    describe('getPreviousFn method', () => {
        it('should return the previous step', () => {
            expect(
                selectors.getPreviousFn('reloading', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps[0]);
        });
        it('should return null if the index is the first step', () => {
            expect(
                selectors.getPreviousFn('common', FileBackedHttpMetadataProviderWizard)
            ).toBeFalsy();
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getPreviousFn('common', null)
            ).toBeFalsy();
        });
    });

    describe('getNextFn method', () => {
        it('should return the previous step', () => {
            expect(
                selectors.getNextFn('common', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps[1]);
        });
        it('should return null if the index is the last step', () => {
            expect(
                selectors.getNextFn('summary', FileBackedHttpMetadataProviderWizard)
            ).toBeFalsy();
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getNextFn('common', null)
            ).toBeFalsy();
        });
    });

    describe('getCurrentFn method', () => {
        it('should return the current step', () => {
            expect(
                selectors.getCurrentFn('common', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps[0]);
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getCurrentFn('common', null)
            ).toBeFalsy();
        });
    });

    describe('getLastFn method', () => {
        it('should return the last step', () => {
            expect(
                selectors.getLastFn('summary', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps.find(step => step.id === 'summary'));
        });
        it('should return nothing if no definition is provided', () => {
            expect(
                selectors.getLastFn('common', null)
            ).toBeFalsy();
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getLastFn('common', FileBackedHttpMetadataProviderWizard)
            ).toBeFalsy();
        });
    });

    describe('getModelFn method', () => {
        it('should return the model', () => {
            const step = FileBackedHttpMetadataProviderWizard.steps.find(s => s.id === 'common');
            expect(selectors.getModelFn(step)).toEqual({});
        });
    });

    describe(`reducer/selector logic functions`, () => {

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
                expect(selectors.getSchemaParseFn(schema, true)).toEqual({
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
                expect(selectors.getSchemaParseFn(schema, false)).toEqual({
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
                expect(selectors.getSchemaParseFn(schema2, true)).toEqual({
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
                expect(selectors.getSchemaLockedFn({ locked: true }, false)).toEqual(false);
            });
        });
    });
});
