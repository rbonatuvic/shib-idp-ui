import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MetadataConfigurationService } from './configuration.service';
import { FileBackedHttpMetadataProviderEditor } from '../../provider/model';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { PATHS } from '../configuration.values';

describe(`Attributes Service`, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                MetadataConfigurationService
            ]
        });
    });

    describe('find method', () => {
        it(`should send an expected GET request`, async(inject([MetadataConfigurationService, HttpTestingController],
            (service: MetadataConfigurationService, backend: HttpTestingController) => {
                const type = 'resolver';
                const id = 'foo';
                service.find(id, type).subscribe();
                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${service.base}/${PATHS[type]}/${id}`
                        && req.method === 'GET';
                }, `GET metadata by id and type`);
            }
        )));
    });

    describe('loadSchema method', () => {
        it(`should send an expected GET request`, async(inject([MetadataConfigurationService, HttpTestingController],
            (service: MetadataConfigurationService, backend: HttpTestingController) => {
                const path = '/foo.json';
                service.loadSchema(path).subscribe();
                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === `${path}`
                        && req.method === 'GET';
                }, `GET schema by path`);
            }
        )));
    });

    describe('getDefinition method', () => {
        it(`should retrieve the editor definition by model type`, async(inject([MetadataConfigurationService, HttpTestingController],
            (service: MetadataConfigurationService, backend: HttpTestingController) => {
                const def = service.getDefinition('FileBackedHttpMetadataResolver');
                expect(def).toBe(FileBackedHttpMetadataProviderEditor);
            }
        )));

        it(`should instantiate an editor for resolvers`, async(inject([MetadataConfigurationService],
            (service: MetadataConfigurationService) => {
                const def = service.getDefinition('foo');
                expect(def instanceof MetadataSourceEditor).toBe(true);
            }
        )));
    });
});
