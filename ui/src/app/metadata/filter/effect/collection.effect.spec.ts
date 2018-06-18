import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';

import { TestActions, getActions } from '../../../../testing/effect.util';
import { MetadataFilter } from '../../domain/model';
import { FilterCollectionEffects } from './collection.effect';
import { MetadataProviderService } from '../../domain/service/provider.service';
import { Router } from '@angular/router';
import { RouterStub } from '../../../../testing/router.stub';

describe('Filter Collection Effects', () => {
    let effects: FilterCollectionEffects;
    let draftService: any;
    let actions$: TestActions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FilterCollectionEffects,
                {
                    provide: MetadataProviderService,
                    useValue: {
                        query: () => { },
                        find: (id: string) => { },
                        save: (f: MetadataFilter) => { },
                        update: (f: MetadataFilter) => { }
                    },
                },
                { provide: Actions, useFactory: getActions },
                { provide: Router, useClass: RouterStub }
            ],
        });

        effects = TestBed.get(FilterCollectionEffects);
        draftService = TestBed.get(MetadataProviderService);
        actions$ = TestBed.get(Actions);
    });
});
