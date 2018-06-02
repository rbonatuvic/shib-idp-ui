import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { empty, Observable, of } from 'rxjs';

import { TestActions, getActions } from '../../../testing/effect.util';
import { MetadataProvider } from '../domain.type';
import { ProviderCollectionEffects } from './provider-collection.effects';
import { EntityDescriptorService } from '../service/entity-descriptor.service';
import { Router } from '@angular/router';
import { RouterStub } from '../../../testing/router.stub';

describe('Provider Collection Effects', () => {
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
                        save: (e: MetadataProvider) => { },
                        update: (e: MetadataProvider) => { },
                        remove: (e: MetadataProvider) => { },
                        preview: (e: MetadataProvider) => { },
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
