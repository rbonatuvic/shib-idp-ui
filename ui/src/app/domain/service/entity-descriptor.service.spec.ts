import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EntityDescriptorService } from './entity-descriptor.service';


describe(`EntityDescriptorService`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                EntityDescriptorService
            ]
        });
    });

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    describe('query', () => {
        it(`should send an expected query request`, async(inject([EntityDescriptorService, HttpTestingController],
            (service: EntityDescriptorService, backend: HttpTestingController) => {
                service.query().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === '/api/EntityDescriptors'
                        && req.method === 'GET';
                }, `GET EntityDescriptors collection`);
            }
        )));

        it(`should emit an empty array if an error is thrown`, async(inject([EntityDescriptorService, HttpTestingController],
            (service: EntityDescriptorService, backend: HttpTestingController) => {
                service.query().subscribe((next) => {
                    expect(next).toEqual([]);
                });

                backend.expectOne('/api/EntityDescriptors').flush(null, { status: 404, statusText: 'Not Found' });
            }
        )));

        it(`should emit 'true' for 200 Ok`, async(inject([EntityDescriptorService, HttpTestingController],
            (service: EntityDescriptorService, backend: HttpTestingController) => {
                service.query().subscribe((next) => {
                    expect(next).toBeTruthy();
                });

                backend.expectOne('/api/EntityDescriptors').flush([], { status: 200, statusText: 'Ok' });
            }
        )));
    });

    describe('find', () => {
        let id = 'foo';

        it(`should send an expected GET request`, async(inject([EntityDescriptorService, HttpTestingController],
            (service: EntityDescriptorService, backend: HttpTestingController) => {
                service.find(id).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `/api/EntityDescriptor/${id}`
                        && req.method === 'GET';
                }, `GET EntityDescriptor by id`);
            }
        )));

        xit(`should emit an error is thrown`, async(inject([EntityDescriptorService, HttpTestingController],
            (service: EntityDescriptorService, backend: HttpTestingController) => {
                service.find(id).subscribe((next) => {
                    expect(next).toBeFalsy();
                });

                backend.expectOne(`/api/EntityDescriptor/${id}`).flush(null, { status: 404, statusText: 'Not Found' });
            }
        )));

        xit(`should emit 'true' for 200 Ok`, async(inject([EntityDescriptorService, HttpTestingController],
            (service: EntityDescriptorService, backend: HttpTestingController) => {
                service.find(id).subscribe((next) => {
                    expect(next).toBeTruthy();
                });

                backend.expectOne(`/api/EntityDescriptor/${id}`).flush(null, { status: 200, statusText: 'Ok' });
            }
        )));
    });

    describe('removeNulls', () => {
        let obj = {
                foo: null,
                bar: 'baz'
            },
            expected = {
                bar: 'baz'
            };
        it(`should remove null values from the object provided`, inject([EntityDescriptorService], (service) => {
            expect(service.removeNulls(obj)).toEqual(expected);
        }));

        it(`should return an empty object if passed a falsy value`, inject([EntityDescriptorService], (service) => {
            expect(service.removeNulls(undefined)).toEqual({});
        }));
    });
});