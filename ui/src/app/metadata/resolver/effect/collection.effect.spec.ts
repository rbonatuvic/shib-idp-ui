import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';

import { TestActions, getActions } from '../../../../testing/effect.util';
import { MetadataResolver } from '../../domain/model';
import { ResolverCollectionEffects } from './collection.effects';
import { ResolverService } from '../../domain/service/resolver.service';
import { RouterStub } from '../../../../testing/router.stub';

describe('Resolver Collection Effects', () => {
    let effects: ResolverCollectionEffects;
    let draftService: any;
    let actions$: TestActions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ResolverCollectionEffects,
                {
                    provide: ResolverService,
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

        effects = TestBed.get(ResolverCollectionEffects);
        draftService = TestBed.get(ResolverService);
        actions$ = TestBed.get(Actions);
    });
});
