import { reducer } from './search.reducer';
import * as fromProviderSearch from './search.reducer';
import { SearchActionTypes, SearchActionUnion, SearchIds, SearchIdsSuccess, SearchIdsError } from '../action/search.action';

const snapshot: fromProviderSearch.SearchState = {
    matches: [],
    query: '',
    searching: false
};

describe('Provider -> Search Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);
            expect(result).toEqual(snapshot);
        });
    });

    describe(`${SearchActionTypes.SEARCH_IDS} action`, () => {
        it('should set properties on the state', () => {
            const query = 'foo';
            const result = reducer(snapshot, new SearchIds(query));

            expect(result).toEqual({
                ...snapshot,
                query,
                searching: true
            });
        });
    });

    describe(`${SearchActionTypes.SEARCH_IDS_SUCCESS} action`, () => {
        it('should set properties on the state', () => {
            const matches = ['foo', 'bar', 'baz'];
            const result = reducer(snapshot, new SearchIdsSuccess(matches));

            expect(result).toEqual({
                ...snapshot,
                matches,
                searching: false
            });
        });
    });

    describe(`${SearchActionTypes.SEARCH_IDS_ERROR} action`, () => {
        it('should set properties on the state', () => {
            const result = reducer(snapshot, new SearchIdsError(new Error()));

            expect(result).toEqual({
                ...snapshot,
                matches: [],
                searching: false
            });
        });
    });

    describe(`getQuery selector function`, () => {
        it('should return the query property', () => {
            expect(fromProviderSearch.getQuery(snapshot)).toBe(snapshot.query);
        });
    });
    describe(`getMatches selector function`, () => {
        it('should return the matches property', () => {
            expect(fromProviderSearch.getMatches(snapshot)).toBe(snapshot.matches);
        });
    });
    describe(`getSearching selector function`, () => {
        it('should return the searching property', () => {
            expect(fromProviderSearch.getSearching(snapshot)).toBe(snapshot.searching);
        });
    });
});
