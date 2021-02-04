import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { ApiPathInterceptor } from './api-path.interceptor';
import { APP_BASE_HREF } from '@angular/common';

describe('API Path Interceptor Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                {
                    provide: APP_BASE_HREF,
                    useValue: '/shibui/'
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ApiPathInterceptor,
                    multi: true
                }
            ]
        });
    });

    describe('query', () => {
        it(`should send an expected query request`, waitForAsync(inject([HttpClient, HttpTestingController],
            (service: HttpClient, backend: HttpTestingController) => {
                service.get('foo').subscribe();

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === '/shibui/foo'
                        && req.method === 'GET';
                }, `GET collection`);
            }
        )));
    });
});
