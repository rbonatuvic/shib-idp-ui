import { reducer, adapter } from './draft.reducer';
import * as fromDrafts from './draft.reducer';
import * as draftActions from '../action/draft.action';
import { MetadataResolver } from '../../domain/model';

let drafts: MetadataResolver[] = [
        { entityId: 'foo', serviceProviderName: 'bar' } as MetadataResolver,
        { entityId: 'baz', serviceProviderName: 'fin' } as MetadataResolver
    ],
    snapshot: fromDrafts.DraftState = {
        ids: [drafts[0].entityId, drafts[1].entityId],
        entities: {
            [drafts[0].entityId]: drafts[0],
            [drafts[1].entityId]: drafts[1]
        },
        selectedDraftId: null
    };

describe('Draft Reducer', () => {
    const initialState: fromDrafts.DraftState = {
        ids: [],
        entities: {},
        selectedDraftId: null
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(initialState);
        });
    });

    describe('Load Drafts: Success', () => {
        it('should add the loaded drafts to the collection', () => {
            const action = new draftActions.LoadDraftSuccess(drafts);
            const result = reducer(initialState, action);

            expect(result).toEqual(
                Object.assign({}, initialState, snapshot)
            );
        });
    });

    describe('Update Drafts: Success', () => {
        it('should update the draft of the specified entityId', () => {
            let changes = { ...drafts[1], serviceProviderName: 'foo' },
                expected = {
                    ids: [drafts[0].entityId, drafts[1].entityId],
                    entities: {
                        [drafts[0].entityId]: drafts[0],
                        [drafts[1].entityId]: changes
                    },
                    selectedDraftId: null
                };
            spyOn(adapter, 'updateOne');
            const action = new draftActions.UpdateDraftSuccess({id: changes.id, changes });
            const result = reducer({ ...snapshot }, action);

            expect(adapter.updateOne).toHaveBeenCalled();
        });

        it('should return state if the entityId is not found', () => {
            let changes = { ...drafts[1], serviceEnabled: true, entityId: 'bar' };
            const action = new draftActions.UpdateDraftSuccess({id: changes.id, changes});
            const result = reducer({ ...snapshot }, action);

            expect(result).toEqual(snapshot);
        });
    });

    describe('Select Draft', () => {
        it('should update the selected draft id', () => {
            let id = 'foo',
                expected = { ...snapshot, selectedDraftId: id };
            const action = new draftActions.SelectDraft(id);
            const result = reducer({ ...snapshot }, action);

            expect(result).toEqual(
                Object.assign({}, initialState, expected)
            );
        });
    });
    describe('Selectors', () => {
        it('getEntities should return all drafts', () => {
            expect(fromDrafts.selectDraftEntities({
                ids: [],
                entities: {},
            })).toEqual({});
            expect(fromDrafts.selectDraftEntities(snapshot)).toEqual(snapshot.entities);
        });

        it('getIds should return all Ids', () => {
            expect(fromDrafts.selectDraftIds({
                ids: [],
                entities: {}
            })).toEqual([]);
            expect(fromDrafts.selectDraftIds(snapshot)).toEqual(snapshot.ids);
        });

        it('getSelectedDraftId should return the selected entityId', () => {
            expect(fromDrafts.getSelectedDraftId({
                ids: [],
                entities: {},
                selectedDraftId: null,
            })).toBeNull();
            expect(fromDrafts.getSelectedDraftId(Object.assign({}, snapshot, { selectedDraftId: 'foo' }))).toEqual('foo');
        });

        it('getAll return all entities as an array', () => {
            expect(fromDrafts.selectAllDrafts(snapshot)).toEqual(drafts);
        });
    });
});
