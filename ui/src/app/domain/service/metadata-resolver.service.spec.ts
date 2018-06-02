import { TestBed, async, inject } from '@angular/core/testing';
import { EntityValidators } from './entity-validators.service';
import { Observable } from 'rxjs';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { MetadataResolverService } from './metadata-resolver.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Filter } from '../entity/filter';

describe(`Metadata Resolver Service`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                MetadataResolverService
            ]
        });
    });

    describe('query method', () => {
        it(`should send an expected GET[] request`, async(inject([MetadataResolverService, HttpTestingController],
            (service: MetadataResolverService, backend: HttpTestingController) => {
                service.query().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}s`
                        && req.method === 'GET';
                }, `GET MetadataResolvers collection`);
            }
        )));
    });
    describe('find method', () => {
        it(`should send an expected GET request`, async(inject([MetadataResolverService, HttpTestingController],
            (service: MetadataResolverService, backend: HttpTestingController) => {
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
        it(`should send an expected PUT request`, async(inject([MetadataResolverService, HttpTestingController],
            (service: MetadataResolverService, backend: HttpTestingController) => {
                const id = 'foo';
                const filter = new Filter({id});
                service.update(filter).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}/${id}`
                        && req.method === 'PUT';
                }, `PUT (update) MetadataResolvers collection`);
            }
        )));
    });
    describe('save method', () => {
        it(`should send an expected POST request`, async(inject([MetadataResolverService, HttpTestingController],
            (service: MetadataResolverService, backend: HttpTestingController) => {
                const id = 'foo';
                const filter = new Filter({ id });
                service.save(filter).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.endpoint}`
                        && req.method === 'POST';
                }, `POST MetadataResolvers collection`);
            }
        )));
    });
});
