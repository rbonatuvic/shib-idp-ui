import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MetadataConfigurationService } from './configuration.service';
import { FileBackedHttpMetadataProviderEditor } from '../../provider/model';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { ResolverService } from '../../domain/service/resolver.service';
import { of } from 'rxjs';
import { MetadataProviderService } from '../../domain/service/provider.service';

describe(`Configuration Service`, () => {

    let resolverService: any;

    let mockService = {
        find: () => of([])
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                MetadataConfigurationService,
                {
                    provide: ResolverService,
                    useValue: mockService
                },
                {
                    provide: MetadataProviderService,
                    useValue: mockService
                }
            ]
        });

        resolverService = TestBed.get(ResolverService);

    });

    describe('find method', () => {
        it(`should send an expected GET request`, async(inject([MetadataConfigurationService, HttpTestingController],
            (service: MetadataConfigurationService, backend: HttpTestingController) => {
                spyOn(resolverService, 'find').and.callThrough();
                const type = 'resolver';
                const id = 'foo';
                service.find(id, type).subscribe();
                expect(resolverService.find).toHaveBeenCalledWith(id);
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
