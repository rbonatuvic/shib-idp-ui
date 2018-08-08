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
                    required: 'foo'
                } },
                path: ''
            })).toBe(true);
        }));
    });
});
