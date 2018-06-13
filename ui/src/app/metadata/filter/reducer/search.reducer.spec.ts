import { reducer } from './search.reducer';
import * as fromFilter from './search.reducer';
import * as actions from '../action/search.action';

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

    describe(`${actions.VIEW_MORE_IDS} action`, () => {
        it('should set viewMore property to true', () => {
            const result = reducer(snapshot, new actions.ViewMoreIds('foo'));

            expect(result.viewMore).toBe(true);
        });
    });

    describe(`${actions.CANCEL_VIEW_MORE} action`, () => {
        it('should set viewMore property to false', () => {
            const result = reducer(snapshot, new actions.CancelViewMore());

            expect(result.viewMore).toBe(false);
        });
    });

    describe(`${actions.QUERY_ENTITY_IDS} action`, () => {
        it('should set loading property to true', () => {
            const result = reducer(snapshot, new actions.QueryEntityIds({ term: 'foo' }));

            expect(result.loading).toBe(true);
        });
    });

    describe(`${actions.LOAD_ENTITY_IDS_SUCCESS} action`, () => {
        it('should set loading property to false and the entityIds property to the provided payload', () => {
            const ids = ['foo'];
            const result = reducer(snapshot, new actions.LoadEntityIdsSuccess(ids));

            expect(result.loading).toBe(false);
            expect(result.entityIds).toBe(ids);
        });
    });

    describe(`${actions.LoadEntityIdsError} action`, () => {
        it('should set loading property to false and the error property to the provided payload', () => {
            const err = new Error('Foobar!');
            const result = reducer(snapshot, new actions.LoadEntityIdsError(err));

            expect(result.loading).toBe(false);
            expect(result.error).toBe(err);
        });
    });
});
