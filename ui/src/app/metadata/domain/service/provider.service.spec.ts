import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { MetadataProviderService } from './provider.service';
import { MetadataProvider } from '../model';

describe(`Metadata Provider Service`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                MetadataProviderService
            ]
        });
    });

    describe('query method', () => {
        it(`should send an expected GET[] request`, waitForAsync(inject([MetadataProviderService, HttpTestingController],
            (service: MetadataProviderService, backend: HttpTestingController) => {
                service.query().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}`
                        && req.method === 'GET';
                }, `GET MetadataResolvers collection`);
            }
        )));
    });
    describe('find method', () => {
        it(`should send an expected GET request`, waitForAsync(inject([MetadataProviderService, HttpTestingController],
            (service: MetadataProviderService, backend: HttpTestingController) => {
                const id = 'foo';
                service.find(id).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${id}`
                        && req.method === 'GET';
                }, `GET MetadataResolvers collection`);
            }
        )));
    });
    describe('update method', () => {
        it(`should send an expected PUT request`, waitForAsync(inject([MetadataProviderService, HttpTestingController],
            (service: MetadataProviderService, backend: HttpTestingController) => {
                const id = 'foo';
                const provider = <MetadataProvider>{ resourceId: id };
                service.update(provider).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${id}`
                        && req.method === 'PUT';
                }, `PUT (update) MetadataResolvers collection`);
            }
        )));
    });
    describe('save method', () => {
        it(`should send an expected POST request`, waitForAsync(inject([MetadataProviderService, HttpTestingController],
            (service: MetadataProviderService, backend: HttpTestingController) => {
                const id = 'foo';
                const provider = <MetadataProvider>{ resourceId: id };
                service.save(provider).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}`
                        && req.method === 'POST';
                }, `POST MetadataResolvers collection`);
            }
        )));
    });
});
