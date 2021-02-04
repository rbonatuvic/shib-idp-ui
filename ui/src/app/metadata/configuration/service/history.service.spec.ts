import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MetadataHistoryService } from './history.service';
import { of } from 'rxjs';
import { PATHS } from '../configuration.values';
import { Metadata } from '../../domain/domain.type';

describe(`Attributes Service`, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                MetadataHistoryService
            ]
        });
    });

    describe('query method', () => {
        it(`should return a MetadataHistory`, waitForAsync(inject([MetadataHistoryService, HttpTestingController],
            (service: MetadataHistoryService) => {
                service.query('foo', 'resolver').subscribe(history => {
                    expect(history).toBeDefined();
                });
            }
        )));
    });

    describe('getVersions method', () => {
        it(`should join a list of observables`, waitForAsync(inject([MetadataHistoryService, HttpTestingController],
            (service: MetadataHistoryService) => {
                spyOn(service, 'getVersion').and.returnValue(of());
                service.getVersions('foo', ['abc', 'def'], 'resolver').subscribe(history => {
                    expect(service.getVersion).toHaveBeenCalledTimes(2);
                });
            }
        )));
    });

    describe('getVersion method', () => {
        it(`should get the primary version of the resource`, waitForAsync(inject([MetadataHistoryService, HttpTestingController],
            (service: MetadataHistoryService, backend: HttpTestingController) => {
                const resourceId = 'foo';
                const type = 'resource';
                service.getVersion(resourceId, type).subscribe();
                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}/${PATHS[type]}/${resourceId}`
                        && req.method === 'GET';
                }, `GET schema by path`);
            }
        )));
        it(`should get the provided version of the resource`, waitForAsync(inject([MetadataHistoryService, HttpTestingController],
            (service: MetadataHistoryService, backend: HttpTestingController) => {
                const resourceId = 'foo';
                const type = 'resource';
                const versionId = '1';
                service.getVersion(resourceId, type, versionId).subscribe();
                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}/${PATHS[type]}/${resourceId}/${service.path}/${versionId}`
                        && req.method === 'GET';
                }, `GET schema by path`);
            }
        )));
    });

    describe('updateVersion method', () => {
        it(`should send a put request`, waitForAsync(inject([MetadataHistoryService, HttpTestingController],
            (service: MetadataHistoryService, backend: HttpTestingController) => {
                const resourceId = 'foo';
                const type = 'resource';
                const versionId = '1';
                service.updateVersion(resourceId, type, {} as Metadata).subscribe();
                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}/${PATHS[type]}/${resourceId}`
                        && req.method === 'PUT';
                }, `PUT schema by path`);
            }
        )));
    });
});
