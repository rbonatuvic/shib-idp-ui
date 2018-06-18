import { TestBed, async, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { MetadataProviderService } from './provider.service';
import { EntityAttributesFilter } from '../entity';

xdescribe(`Metadata Provider Service`, () => {

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
        it(`should send an expected GET[] request`, async(inject([MetadataProviderService, HttpTestingController],
            (service: MetadataProviderService, backend: HttpTestingController) => {
                service.query().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}s`
                        && req.method === 'GET';
                }, `GET MetadataResolvers collection`);
            }
        )));
    });
    describe('find method', () => {
        it(`should send an expected GET request`, async(inject([MetadataProviderService, HttpTestingController],
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
        it(`should send an expected PUT request`, async(inject([MetadataProviderService, HttpTestingController],
            (service: MetadataProviderService, backend: HttpTestingController) => {
                const id = 'foo';
                const filter = new EntityAttributesFilter({id});
                service.update(filter).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${id}`
                        && req.method === 'PUT';
                }, `PUT (update) MetadataResolvers collection`);
            }
        )));
    });
    describe('save method', () => {
        it(`should send an expected POST request`, async(inject([MetadataProviderService, HttpTestingController],
            (service: MetadataProviderService, backend: HttpTestingController) => {
                const id = 'foo';
                const filter = new EntityAttributesFilter({ id });
                service.save(filter).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}`
                        && req.method === 'POST';
                }, `POST MetadataResolvers collection`);
            }
        )));
    });
});
