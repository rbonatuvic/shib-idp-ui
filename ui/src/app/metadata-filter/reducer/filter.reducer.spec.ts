import { reducer } from './filter.reducer';
import * as fromFilter from './filter.reducer';
import * as actions from '../action/filter.action';

const snapshot: fromFilter.FilterState = {
    entityIds: [],
    selected: null,
    viewMore: false,
    loading: false,
    error: null
};

describe('Filter Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${ actions.VIEW_MORE_IDS } action`, () => {
        it('should set viewMore property to true', () => {
            const result = reducer(snapshot, new actions.ViewMoreIds([]));

            expect(result.viewMore).toBe(true);
        });
    });

    describe(`${ actions.SELECT_ID } action`, () => {
        it('should set viewMore property to false and selected to the provided payload', () => {
            const id = 'foo';
            const result = reducer(snapshot, new actions.SelectId(id));

            expect(result.viewMore).toBe(false);
            expect(result.selected).toBe(id);
        });
    });

    describe(`${actions.CANCEL_VIEW_MORE} action`, () => {
        it('should set viewMore property to false', () => {
            const result = reducer(snapshot, new actions.CancelViewMore());

            expect(result.viewMore).toBe(false);
        });
    });

    describe(`${actions.LOAD_ENTITY_IDS} action`, () => {
        it('should set loading property to true', () => {
            const result = reducer(snapshot, new actions.LoadEntityIds('foo'));

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
