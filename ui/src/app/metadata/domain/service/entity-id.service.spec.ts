import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EntityIdService } from './entity-id.service';


describe(`EntityIdService`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                EntityIdService
            ]
        });
    });

    describe('query', () => {
        let query = {
            term: 'foo',
            limit: 10,
            offset: 1
        };

        it(`should send an expected GET request`, waitForAsync(inject([EntityIdService, HttpTestingController],
            (service: EntityIdService, backend: HttpTestingController) => {
                service.query(query).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${service.searchEndpoint}`
                        && req.method === 'GET';
                }, `GET EntityIds by term`);
            }
        )));
    });
});
