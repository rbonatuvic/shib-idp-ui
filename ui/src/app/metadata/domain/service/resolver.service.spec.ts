import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResolverService } from './resolver.service';


describe(`Resolver Service`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                ResolverService
            ]
        });
    });

    describe('query', () => {
        it(`should send an expected query request`, async(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.query().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === '/api/EntityDescriptors'
                        && req.method === 'GET';
                }, `GET EntityDescriptors collection`);
            }
        )));

        xit(`should emit 'true' for 200 Ok`, async(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.query().subscribe((next) => {
                    expect(next).toBeTruthy();
                });

                backend.expectOne('/api/EntityDescriptors').flush([], { status: 200, statusText: 'Ok' });
            }
        )));
    });

    describe('find', () => {
        let id = 'foo';

        it(`should send an expected GET request`, async(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.find(id).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `/api/EntityDescriptor/${id}`
                        && req.method === 'GET';
                }, `GET EntityDescriptor by id`);
            }
        )));
    });
});
