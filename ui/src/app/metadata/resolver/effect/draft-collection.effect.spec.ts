import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';

import { TestActions, getActions } from '../../../../testing/effect.util';
import { DraftCollectionEffects, getPayload } from './draft-collection.effects';
import { EntityDraftService } from '../../domain/service/draft.service';
import { MetadataResolver } from '../../domain/model';
import { RouterStub } from '../../../../testing/router.stub';
import { AddDraftRequest } from '../action/draft.action';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';
import * as fromRoot from '../../../app.reducer';


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
                        save: (provider: MetadataResolver) => { },
                        remove: (provider: MetadataResolver) => { },
                        update: (provider: MetadataResolver) => { }
                    },
                },
                { provide: Actions, useFactory: getActions },
                { provide: Router, useClass: RouterStub }
            ],
            imports: [
                StoreModule.forRoot(fromRoot.reducers)
            ]
        });

        effects = TestBed.get(DraftCollectionEffects);
        draftService = TestBed.get(EntityDraftService);
        actions$ = TestBed.get(Actions);
    });

    describe('getPayload', () => {
        it('should return the action payload', () => {
            const payload = new FileBackedHttpMetadataResolver({ id: 'foo' });
            const action = new AddDraftRequest(payload);
            expect(getPayload(action)).toEqual(payload);
        });
    });
});
