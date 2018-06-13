import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';

import { TestActions, getActions } from '../../../../testing/effect.util';
import { MetadataResolver } from '../model';
import { ProviderCollectionEffects } from './provider-collection.effects';
import { EntityDescriptorService } from '../service/entity-descriptor.service';
import { Router } from '@angular/router';
import { RouterStub } from '../../../../testing/router.stub';

describe('Resolver Collection Effects', () => {
    let effects: ProviderCollectionEffects;
    let draftService: any;
    let actions$: TestActions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderCollectionEffects,
                {
                    provide: EntityDescriptorService,
                    useValue: {
                        query: () => { },
                        find: (id: string) => { },
                        save: (e: MetadataResolver) => { },
                        update: (e: MetadataResolver) => { },
                        remove: (e: MetadataResolver) => { },
                        preview: (e: MetadataResolver) => { },
                        upload: (name: string, xml: string) => { },
                        createFromUrl: (name: string, url: string) => { }
                    },
                },
                { provide: Actions, useFactory: getActions },
                { provide: Router, useClass: RouterStub }
            ],
        });

        effects = TestBed.get(ProviderCollectionEffects);
        draftService = TestBed.get(EntityDescriptorService);
        actions$ = TestBed.get(Actions);
    });
});
