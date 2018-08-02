import { TestBed, async, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { MetadataFilterService } from './filter.service';
import { EntityAttributesFilter } from '../entity';

describe(`Metadata Filter Service`, () => {

    const provider = 'foo';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                MetadataFilterService
            ]
        });
    });

    describe('query method', () => {
        it(`should send an expected GET[] request`, async(inject([MetadataFilterService, HttpTestingController],
            (service: MetadataFilterService, backend: HttpTestingController) => {
                service.query(provider).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${provider}/Filters`
                        && req.method === 'GET';
                }, `GET MetadataFilter collection`);
            }
        )));
    });
    describe('find method', () => {
        it(`should send an expected GET request`, async(inject([MetadataFilterService, HttpTestingController],
            (service: MetadataFilterService, backend: HttpTestingController) => {
                const id = 'bar';
                service.find(provider, id).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${provider}/Filters/${id}`
                        && req.method === 'GET';
                }, `GET MetadataFilter`);
            }
        )));
    });
    describe('update method', () => {
        it(`should send an expected PUT request`, async(inject([MetadataFilterService, HttpTestingController],
            (service: MetadataFilterService, backend: HttpTestingController) => {
                const id = 'bar';
                const filter = new EntityAttributesFilter({ resourceId: id });
                service.update(provider, filter).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${provider}/Filters/${ id }`
                        && req.method === 'PUT';
                }, `PUT (update) MetadataFilter`);
            }
        )));
    });
    describe('save method', () => {
        it(`should send an expected POST request`, async(inject([MetadataFilterService, HttpTestingController],
            (service: MetadataFilterService, backend: HttpTestingController) => {
                const id = 'bar';
                const filter = new EntityAttributesFilter({ id });
                service.save(provider, filter).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${provider}/Filters`
                        && req.method === 'POST';
                }, `POST MetadataFilter`);
            }
        )));
    });
});
