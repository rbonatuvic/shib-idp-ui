import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { empty, Observable, of } from 'rxjs';

import { TestActions, getActions } from '../../../testing/effect.util';
import { DraftCollectionEffects, getPayload } from './draft-collection.effects';
import { EntityDraftService } from '../service/entity-draft.service';
import { MetadataProvider } from '../domain.type';
import { Router } from '@angular/router';
import { RouterStub } from '../../../testing/router.stub';
import { LoadDraftRequest, AddDraftRequest } from '../action/draft-collection.action';
import { Provider } from '../entity/provider';

describe('Draft Collection Effects', () => {
    let effects: DraftCollectionEffects;
    let draftService: any;
    let actions$: TestActions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DraftCollectionEffects,
                {
                    provide: EntityDraftService,
                    useValue: {
                        query: () => { },
                        find: (id: string) => { },
                        save: (provider: MetadataProvider) => { },
                        remove: (provider: MetadataProvider) => { },
                        update: (provider: MetadataProvider) => { }
                    },
                },
                { provide: Actions, useFactory: getActions },
                { provide: Router, useClass: RouterStub }
            ],
        });

        effects = TestBed.get(DraftCollectionEffects);
        draftService = TestBed.get(EntityDraftService);
        actions$ = TestBed.get(Actions);
    });

    describe('getPayload', () => {
        it('should return the action payload', () => {
            const payload = new Provider({ id: 'foo' });
            const action = new AddDraftRequest(payload);
            expect(getPayload(action)).toEqual(payload);
        });
    });
});
