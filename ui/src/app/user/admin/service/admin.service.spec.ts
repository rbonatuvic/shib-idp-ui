import { TestBed, async, inject } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest, HttpClientModule } from '@angular/common/http';
import { Admin } from '../model/admin';

let users = <Admin[]>[
    {
        resourceId: 'abc',
        role: 'SUPER_ADMIN',
        email: 'foo@bar.com',
        name: {
            first: 'Jane',
            last: 'Doe'
        }
    },
    {
        resourceId: 'def',
        role: 'DELEGATED_ADMIN',
        email: 'bar@baz.com',
        name: {
            first: 'John',
            last: 'Doe'
        }
    }
];

describe('Admin Service', () => {
    // let service: AdminService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                AdminService
            ]
        });
        // service = TestBed.get(AdminService);
    });

    describe('query', () => {
        it(`should send an expected query request`, async(inject([AdminService, HttpTestingController],
            (service: AdminService, backend: HttpTestingController) => {
                service.query().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === '/api/users'
                        && req.method === 'GET';
                }, `GET admin collection`);
            }
        )));
    });
    describe('update method', () => {
        it(`should send an expected put request`, async(inject([AdminService, HttpTestingController],
            (service: AdminService, backend: HttpTestingController) => {
                service.update({...users[0]}).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === '/api/users/abc'
                        && req.method === 'PUT';
                }, `PUT admin user`);
            }
        )));
    });
    describe('remove method', () => {
        it(`should send an expected delete request`, async(inject([AdminService, HttpTestingController],
            (service: AdminService, backend: HttpTestingController) => {
                service.remove(users[0].resourceId).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === '/api/users/abc'
                        && req.method === 'DELETE';
                }, `DELETE admin user`);
            }
        )));
    });
});
