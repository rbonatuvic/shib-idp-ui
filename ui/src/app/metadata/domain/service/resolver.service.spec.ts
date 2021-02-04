import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResolverService } from './resolver.service';
import API_BASE_PATH from '../../../app.constant';


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
        it(`should send an expected query request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.query().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${API_BASE_PATH}/EntityDescriptors`
                        && req.method === 'GET';
                }, `GET EntityDescriptors collection`);
            }
        )));

        it(`should emit 'true' for 200 Ok`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.query().subscribe((next) => {
                    expect(next).toBeTruthy();
                });

                backend.expectOne(`${API_BASE_PATH}/EntityDescriptors`).flush(['foo'], { status: 200, statusText: 'Ok' });
            }
        )));
    });

    describe('queryForAdmin', () => {
        it(`should send an expected query request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.queryForAdmin().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${API_BASE_PATH}/EntityDescriptor/disabledNonAdmin`
                        && req.method === 'GET';
                }, `GET EntityDescriptors collection for an admin`);
            }
        )));

        it(`should emit 'true' for 200 Ok`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.queryForAdmin().subscribe((next) => {
                    expect(next).toBeTruthy();
                });

                backend.expectOne(`${API_BASE_PATH}/EntityDescriptor/disabledNonAdmin`).flush(['foo'], { status: 200, statusText: 'Ok' });
            }
        )));
    });

    describe('find', () => {
        let id = 'foo';

        it(`should send an expected GET request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.find(id).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${API_BASE_PATH}/EntityDescriptor/${id}`
                        && req.method === 'GET';
                }, `GET EntityDescriptor by id`);
            }
        )));
    });

    describe('update', () => {
        let id = 'foo',
            serviceProviderName = 'Test Provider',
            createdBy = 'admin';

        it(`should send an expected PUT request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.update({id, serviceProviderName, createdBy}).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${ API_BASE_PATH }/EntityDescriptor/${id}`
                        && req.method === 'PUT';
                }, `PUT EntityDescriptor by id`);
            }
        )));
    });

    describe('create', () => {
        let id = 'foo',
            serviceProviderName = 'Test Provider',
            createdBy = 'admin';

        it(`should send an expected POST request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.save({ id, serviceProviderName, createdBy }).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `api/EntityDescriptor`
                        && req.method === 'POST';
                }, `POST new EntityDescriptor`);
            }
        )));
    });

    describe('remove', () => {
        let id = 'foo',
            serviceProviderName = 'Test Provider',
            createdBy = 'admin';

        it(`should send an expected PUT request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.remove({ id, serviceProviderName, createdBy }).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `api/EntityDescriptor/${id}`
                        && req.method === 'DELETE';
                }, `DELETE an EntityDescriptor`);
            }
        )));
    });

    describe('preview', () => {
        let id = 'foo';

        it(`should send an expected GET request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                service.preview(id).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `api/EntityDescriptor/${id}`
                        && req.method === 'GET'
                        && req.headers.get('Accept') === 'application/xml'
                        && req.responseType === 'text';
                }, `GET an EntityDescriptor (xml)`);
            }
        )));
    });

    describe('upload', () => {
        it(`should send an expected POST request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                const name = 'foo', xml = '<foo></foo>';
                service.upload(name, xml).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `api/EntityDescriptor`
                        && req.method === 'POST'
                        && req.headers.get('Content-Type') === 'application/xml';
                }, `POST new EntityDescriptor`);
            }
        )));
    });

    describe('createFromUrl', () => {
        it(`should send an expected POST request`, waitForAsync(inject([ResolverService, HttpTestingController],
            (service: ResolverService, backend: HttpTestingController) => {
                const name = 'foo', url = 'http://goo.gle';
                service.createFromUrl(name, url).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `api/EntityDescriptor`
                        && req.method === 'POST'
                        && req.headers.get('Content-Type') === 'application/x-www-form-urlencoded'
                        && req.body === `metadataUrl=${url}`;
                }, `POST new EntityDescriptor`);
            }
        )));
    });
});
