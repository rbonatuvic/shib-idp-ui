import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { SchemaService } from './schema.service';

describe(`Schema Service`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                SchemaService
            ]
        });
    });

    describe('isRequired method', () => {
        it(`should return false if no property is provided`, inject([SchemaService], (service: SchemaService) => {
            expect(service.isRequired(null)).toBe(false);
        }));
        it(`should return false if no properties are defined`, inject([SchemaService], (service: SchemaService) => {
            expect(service.isRequired({
                parent: { schema: {} },
                path: ''
            })).toBe(false);
        }));

        it(`should return true if the property is required`, inject([SchemaService], (service: SchemaService) => {
            expect(service.isRequired({
                parent: { schema: {
                    properties: {
                        foo: {
                            type: 'string'
                        }
                    },
                    required: ['foo']
                } },
                path: '/foo'
            })).toBe(true);
        }));

        it(`should return true if the property is currently required based on anyOf`,
            inject([SchemaService], (service: SchemaService) => {
                expect(service.isRequired({
                    parent: {
                        schema: {
                            properties: {
                                foo: { type: 'string' },
                                bar: { type: 'string' }
                            },
                            anyOf: [
                                {
                                    properties: {
                                        foo: { enum: [ true ] }
                                    },
                                    required: [ 'bar' ]
                                },
                                {
                                    properties: {
                                        foo: { enum: [ false ] }
                                    }
                                }
                            ]
                        },
                        value: { foo: true }
                    },
                    path: '/bar'
                })).toBe(true);
            })
        );

        it(`should return true if the property is NOT currently required based on anyOf`,
            inject([SchemaService], (service: SchemaService) => {
                expect(service.isRequired({
                    parent: {
                        schema: {
                            properties: {
                                foo: { type: 'string' },
                                bar: { type: 'string' }
                            },
                            anyOf: [
                                {
                                    properties: {
                                        foo: { enum: [true] }
                                    },
                                    required: ['bar']
                                },
                                {
                                    properties: {
                                        foo: { enum: [false] }
                                    }
                                }
                            ]
                        },
                        value: { foo: false }
                    },
                    path: '/bar'
                })).toBe(false);
            })
        );

        it(`should return false if the property is NOT currently in any values`,
            inject([SchemaService], (service: SchemaService) => {
                expect(service.isRequired({
                    parent: {
                        schema: {
                            properties: {
                                foo: { type: 'string' },
                                bar: { type: 'string' }
                            },
                            anyOf: [
                                {
                                    properties: {
                                        foo: { enum: [true] }
                                    },
                                    required: ['bar']
                                },
                                {
                                    properties: {
                                        foo: { enum: [false] }
                                    }
                                }
                            ]
                        },
                        value: {}
                    },
                    path: '/bar'
                })).toBe(false);
            })
        );

        it(`should return true if dependant on multiple values and any is true`,
            inject([SchemaService], (service: SchemaService) => {
                expect(service.isRequired({
                    parent: {
                        schema: {
                            properties: {
                                foo: { type: 'string' },
                                bar: { type: 'string' },
                                baz: { type: 'string' }
                            },
                            anyOf: [
                                {
                                    properties: {
                                        foo: { enum: [true] }
                                    },
                                    required: ['bar']
                                },
                                {
                                    properties: {
                                        baz: { enum: [true] }
                                    },
                                    required: ['bar']
                                },
                                {
                                    properties: {
                                        foo: { enum: [false] }
                                    }
                                }
                            ]
                        },
                        value: {
                            foo: true,
                            baz: true
                        }
                    },
                    path: '/bar'
                })).toBe(true);
            })
        );

        it(`should return true if dependency is active`,
            inject([SchemaService], (service: SchemaService) => {
                expect(service.isRequired({
                    parent: {
                        schema: {
                            properties: {
                                foo: { type: 'string' },
                                bar: { type: 'string' },
                                baz: { type: 'string' }
                            },
                            dependencies: {
                                foo: { required: ['bar', 'baz'] },
                                bar: { required: ['foo', 'baz'] },
                                baz: { required: ['foo', 'bar'] }
                            }
                        },
                        value: {
                            foo: 'abcdef'
                        }
                    },
                    path: '/bar'
                })).toBe(true);
            })
        );

        it(`should return true if the property has an active dependency`,
            inject([SchemaService], (service: SchemaService) => {
                expect(service.isRequired({
                    parent: {
                        schema: {
                            properties: {
                                foo: { type: 'string' },
                                bar: { type: 'string' },
                                baz: { type: 'string' }
                            },
                            dependencies: {
                                foo: { required: ['bar', 'baz'] },
                                bar: { required: ['foo', 'baz'] },
                                baz: { required: ['foo', 'bar'] }
                            }
                        },
                        value: {
                            foo: 'abc',
                            bar: '123'
                        }
                    },
                    path: '/foo'
                })).toBe(true);
            })
        );

        it(`should return false if no dependencies are defined`,
            inject([SchemaService], (service: SchemaService) => {
                expect(service.isRequired({
                    parent: {
                        schema: {
                            properties: {
                                foo: { type: 'string' },
                                bar: { type: 'string' },
                                baz: { type: 'string' }
                            }
                        },
                        value: {
                            foo: true,
                            baz: true
                        }
                    },
                    path: '/bar'
                })).toBe(false);
            })
        );
    });

    describe('getRequiredDependencies method', () => {
        it('should return the provided result if an array', inject([SchemaService], (service: SchemaService) => {
            expect(service.getRequiredDependencies(['foo', 'bar'])).toEqual(['foo', 'bar']);
        }));

        it('should return the content of the required attribute if provided', inject([SchemaService], (service: SchemaService) => {
            expect(service.getRequiredDependencies({required: ['foo', 'bar'] })).toEqual(['foo', 'bar']);
        }));

        it('should return an empty array if not provided with required property', inject([SchemaService], (service: SchemaService) => {
            expect(service.getRequiredDependencies({ foo: 'bar' })).toEqual([]);
        }));
    });
});
