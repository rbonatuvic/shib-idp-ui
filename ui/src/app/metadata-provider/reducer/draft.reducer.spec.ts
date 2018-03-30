import { reducer } from './draft.reducer';
import * as fromDrafts from './draft.reducer';
import * as draftActions from '../action/draft.action';
import { MetadataProvider } from '../../domain/model/metadata-provider';

let drafts: MetadataProvider[] = [
        { entityId: 'foo', serviceProviderName: 'bar' } as MetadataProvider,
        { entityId: 'baz', serviceProviderName: 'fin' } as MetadataProvider
    ],
    snapshot: fromDrafts.DraftState = {
        ids: [drafts[0].entityId, drafts[1].entityId],
        drafts: {
            [drafts[0].entityId]: drafts[0],
            [drafts[1].entityId]: drafts[1]
        },
        selectedDraftId: null
    };

describe('Draft Reducer', () => {
    const initialState: fromDrafts.DraftState = {
        ids: [],
        drafts: {},
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
            let changes = { ...drafts[1], serviceEnabled: true },
                expected = {
                    ids: [drafts[0].entityId, drafts[1].entityId],
                    drafts: {
                        [drafts[0].entityId]: drafts[0],
                        [drafts[1].entityId]: changes
                    },
                    selectedDraftId: null
                };
            const action = new draftActions.UpdateDraftSuccess(changes);
            const result = reducer({...snapshot}, action);

            expect(result).toEqual(
                Object.assign({}, initialState, expected)
            );
        });

        it('should return state if the entityId is not found', () => {
            let changes = { ...drafts[1], serviceEnabled: true, entityId: 'bar' };
            const action = new draftActions.UpdateDraftSuccess(changes);
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
            expect(fromDrafts.getEntities({
                ids: [],
                drafts: {},
                selectedDraftId: null,
            })).toEqual({});
            expect(fromDrafts.getEntities(snapshot)).toEqual(snapshot.drafts);
        });

        it('getIds should return all Ids', () => {
            expect(fromDrafts.getIds({
                ids: [],
                drafts: {},
                selectedDraftId: null,
            })).toEqual([]);
            expect(fromDrafts.getIds(snapshot)).toEqual(snapshot.ids);
        });

        it('getSelectedDraftId should return the selected entityId', () => {
            expect(fromDrafts.getSelectedId({
                ids: [],
                drafts: {},
                selectedDraftId: null,
            })).toBeNull();
            expect(fromDrafts.getSelectedId(Object.assign({}, snapshot, {selectedDraftId: 'foo'}))).toEqual('foo');
        });

        it('getSelected should return the selected entity by id', () => {
            expect(fromDrafts.getSelected(Object.assign({}, snapshot, { selectedDraftId: 'foo' }))).toEqual(drafts[0]);
        });

        it('getAll return all entities as an array', () => {
            expect(fromDrafts.getAll(snapshot)).toEqual(drafts);
        });
    });
});
