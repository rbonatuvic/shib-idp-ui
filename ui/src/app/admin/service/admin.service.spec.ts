import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest, HttpClientModule } from '@angular/common/http';
import { Admin } from '../model/admin';
import API_BASE_PATH from '../../app.constant';

let users = <Admin[]>[
    {
        username: 'abc',
        role: 'ROLE_ADMIN',
        emailAddress: 'foo@bar.com',
        firstName: 'Jane',
        lastName: 'Doe'
    },
    {
        username: 'def',
        role: 'ROLE_USER',
        emailAddress: 'bar@baz.com',
        firstName: 'John',
        lastName: 'Doe'
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
        it(`should send an expected query request`, waitForAsync(inject([AdminService, HttpTestingController],
            (service: AdminService, backend: HttpTestingController) => {
                service.query().subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${API_BASE_PATH}/admin/users`
                        && req.method === 'GET';
                }, `GET admin collection`);
            }
        )));
    });
    describe('update method', () => {
        it(`should send an expected patch request`, waitForAsync(inject([AdminService, HttpTestingController],
            (service: AdminService, backend: HttpTestingController) => {
                service.update({...users[0]}).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${API_BASE_PATH}/admin/users/abc`
                        && req.method === 'PATCH';
                }, `PATCH admin user`);
            }
        )));
    });
    describe('remove method', () => {
        it(`should send an expected delete request`, waitForAsync(inject([AdminService, HttpTestingController],
            (service: AdminService, backend: HttpTestingController) => {
                service.remove(users[0].username).subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${API_BASE_PATH}/admin/users/abc`
                        && req.method === 'DELETE';
                }, `DELETE admin user`);
            }
        )));
    });
});
