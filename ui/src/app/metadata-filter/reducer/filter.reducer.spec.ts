import { reducer } from './filter.reducer';
import * as fromFilter from './filter.reducer';
import * as actions from '../action/filter.action';

const snapshot: fromFilter.FilterState = {
    selected: null,
    changes: null
};

describe('Filter Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });
});
