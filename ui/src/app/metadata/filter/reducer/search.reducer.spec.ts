import { reducer } from './search.reducer';
import * as fromFilter from './search.reducer';
import {
    SearchActionTypes,
    ViewMoreIds,
    CancelViewMore,
    QueryEntityIds,
    LoadEntityIdsError,
    LoadEntityIdsSuccess
} from '../action/search.action';

const snapshot: fromFilter.SearchState = {
    entityIds: [],
    viewMore: false,
    loading: false,
    error: null,
    term: '',
};

describe('Filter Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${SearchActionTypes.VIEW_MORE_IDS} action`, () => {
        it('should set viewMore property to true', () => {
            const result = reducer(snapshot, new ViewMoreIds('foo'));

            expect(result.viewMore).toBe(true);
        });
    });

    describe(`${SearchActionTypes.CANCEL_VIEW_MORE} action`, () => {
        it('should set viewMore property to false', () => {
            const result = reducer(snapshot, new CancelViewMore());

            expect(result.viewMore).toBe(false);
        });
    });

    describe(`${SearchActionTypes.QUERY_ENTITY_IDS} action`, () => {
        it('should set loading property to true', () => {
            const result = reducer(snapshot, new QueryEntityIds({ term: 'foo' }));

            expect(result.loading).toBe(true);
        });
    });

    describe(`${SearchActionTypes.LOAD_ENTITY_IDS_SUCCESS} action`, () => {
        it('should set loading property to false and the entityIds property to the provided payload', () => {
            const ids = ['foo'];
            const result = reducer(snapshot, new LoadEntityIdsSuccess(ids));

            expect(result.loading).toBe(false);
            expect(result.entityIds).toBe(ids);
        });
    });

    describe(`${SearchActionTypes.LOAD_ENTITY_IDS_ERROR} action`, () => {
        it('should set loading property to false and the error property to the provided payload', () => {
            const err = new Error('Foobar!');
            const result = reducer(snapshot, new LoadEntityIdsError(err));

            expect(result.loading).toBe(false);
            expect(result.error).toBe(err);
        });
    });
});
