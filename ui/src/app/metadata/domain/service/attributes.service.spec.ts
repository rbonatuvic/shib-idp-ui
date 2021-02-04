import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { AttributesService } from './attributes.service';
import { HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe(`Attributes Service`, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                AttributesService
            ]
        });
    });

    describe('query method', () => {
        it(`should call the request attributes method`, waitForAsync(inject([AttributesService, HttpTestingController],
            (service: AttributesService) => {
                spyOn(service, 'requestAttributes').and.returnValue(of([]));
                service.query().subscribe(() => {
                    expect(service.requestAttributes).toHaveBeenCalled();
                });
            }
        )));
    });
    describe('requestAttributes method', () => {
        it(`should send an expected GET request`, waitForAsync(inject([AttributesService, HttpTestingController],
            (service: AttributesService, backend: HttpTestingController) => {
                service.requestAttributes('foo').subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}${'foo'}`
                        && req.method === 'GET';
                }, `GET attributes by term`);
            }
        )));
    });
});
