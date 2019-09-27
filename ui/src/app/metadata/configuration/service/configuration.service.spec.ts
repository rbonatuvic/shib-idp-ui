import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MetadataConfigurationService } from './configuration.service';
import { FileBackedHttpMetadataProviderEditor } from '../../provider/model';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { ResolverService } from '../../domain/service/resolver.service';
import { of } from 'rxjs';
import { MetadataProviderService } from '../../domain/service/provider.service';
import { Metadata } from '../../domain/domain.type';
import { SCHEMA } from '../../../../testing/form-schema.stub';
import { getConfigurationSectionsFn } from '../reducer/utilities';

describe(`Configuration Service`, () => {

    let resolverService: any;
    let providerService: any;

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
        providerService = TestBed.get(MetadataProviderService);

    });

    describe('find method', () => {
        it(`should call the resolver service when type is resolver`, async(inject([MetadataConfigurationService, HttpTestingController],
            (service: MetadataConfigurationService, backend: HttpTestingController) => {
                spyOn(resolverService, 'find').and.callThrough();
                const type = 'resolver';
                const id = 'foo';
                service.find(id, type).subscribe();
                expect(resolverService.find).toHaveBeenCalledWith(id);
            }
        )));
        it(`should call the provider service when type is resolver`, async(inject([MetadataConfigurationService, HttpTestingController],
            (service: MetadataConfigurationService, backend: HttpTestingController) => {
                spyOn(providerService, 'find').and.callThrough();
                const type = 'provider';
                const id = 'foo';
                service.find(id, type).subscribe();
                expect(providerService.find).toHaveBeenCalledWith(id);
            }
        )));
        it(`should throw an error when a type is not found`, async(inject([MetadataConfigurationService, HttpTestingController],
            (service: MetadataConfigurationService, backend: HttpTestingController) => {
                spyOn(providerService, 'find').and.callThrough();
                const type = 'bar';
                const id = 'foo';
                service.find(id, type).subscribe(null, (err) => {
                    expect(err).toEqual(new Error('Type not supported'));
                });
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

    describe('getMetadataConfiguration method', () => {
        it('should return the parsed configuration', async(inject([MetadataConfigurationService],
            (service: MetadataConfigurationService) => {
                const model = {} as Metadata;
                const definition = {steps: []};
                const expected = getConfigurationSectionsFn([model], definition, SCHEMA);
                expect(service.getMetadataConfiguration(model, definition, SCHEMA)).toEqual(expected);
            }
        )));
    });
});
