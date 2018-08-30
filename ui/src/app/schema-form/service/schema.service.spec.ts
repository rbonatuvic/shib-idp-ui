import { TestBed, async, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
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
    });
});
