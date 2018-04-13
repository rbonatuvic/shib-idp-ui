import { reducer } from './filter-collection.reducer';
import * as fromFilter from './filter-collection.reducer';
import * as actions from '../action/filter-collection.action';

const snapshot: fromFilter.FilterCollectionState = {
    ids: [],
    entities: {},
    selectedId: null,
    loaded: false
};

describe('Filter Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });
});
