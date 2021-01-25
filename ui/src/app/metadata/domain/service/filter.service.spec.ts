import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { MetadataFilterService } from './filter.service';
import { EntityAttributesFilterEntity } from '../entity';

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
        it(`should send an expected GET[] request`, waitForAsync(inject([MetadataFilterService, HttpTestingController],
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
        it(`should send an expected GET request`, waitForAsync(inject([MetadataFilterService, HttpTestingController],
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
        it(`should send an expected PUT request`, waitForAsync(inject([MetadataFilterService, HttpTestingController],
            (service: MetadataFilterService, backend: HttpTestingController) => {
                const id = 'bar';
                const filter = new EntityAttributesFilterEntity({ resourceId: id });
                service.update(provider, filter).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${provider}/Filters/${ id }`
                        && req.method === 'PUT';
                }, `PUT (update) MetadataFilter`);
            }
        )));
    });
    describe('save method', () => {
        it(`should send an expected POST request`, waitForAsync(inject([MetadataFilterService, HttpTestingController],
            (service: MetadataFilterService, backend: HttpTestingController) => {
                const id = 'bar';
                const filter = new EntityAttributesFilterEntity({ resourceId: id });
                service.save(provider, filter).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${provider}/Filters`
                        && req.method === 'POST';
                }, `POST MetadataFilter`);
            }
        )));
    });
});
