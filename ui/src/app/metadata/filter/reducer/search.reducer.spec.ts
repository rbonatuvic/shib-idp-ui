import { reducer, initialState as snapshot } from './search.reducer';
import * as fromFilter from './search.reducer';
import {
    SearchActionTypes,
    ViewMoreIds,
    CancelViewMore,
    QueryEntityIds,
    LoadEntityIdsError,
    LoadEntityIdsSuccess,
    ClearSearch
} from '../action/search.action';
import { FilterCollectionActionTypes, UpdateFilterSuccess, AddFilterSuccess } from '../action/collection.action';
import { EntityAttributesFilterEntity } from '../../domain/entity';

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

    describe(`${FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS} action`, () => {
        it('should reset the state', () => {
            const update = {
                id: 'foo',
                changes: new EntityAttributesFilterEntity({ resourceId: 'foo', name: 'bar', createdDate: new Date().toLocaleDateString() }),
            };
            const action = new UpdateFilterSuccess({
                update,
                providerId: 'foo'
            });
            const result = reducer(snapshot, action);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${FilterCollectionActionTypes.ADD_FILTER_SUCCESS} action`, () => {
        it('should reset the state', () => {
            const filter = new EntityAttributesFilterEntity(
                { resourceId: 'foo', name: 'bar', createdDate: new Date().toLocaleDateString() }
            );
            const action = new AddFilterSuccess({
                filter,
                providerId: 'foo'
            });
            const result = reducer(snapshot, action);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${SearchActionTypes.CLEAR_SEARCH} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new ClearSearch());
            expect(result).toEqual(fromFilter.initialState);
        });
    });

    describe('selector methods', () => {
        describe('getViewMore', () => {
            it('should return the state viewMore', () => {
                expect(fromFilter.getViewMore(snapshot)).toBe(snapshot.viewMore);
            });
        });

        describe('getEntityIds', () => {
            it('should return the state entityIds', () => {
                expect(fromFilter.getEntityIds(snapshot)).toBe(snapshot.entityIds);
            });
        });

        describe('getError', () => {
            it('should return the state error', () => {
                expect(fromFilter.getError(snapshot)).toBe(snapshot.error);
            });
        });

        describe('getLoading', () => {
            it('should return the state loading', () => {
                expect(fromFilter.getLoading(snapshot)).toBe(snapshot.loading);
            });
        });

        describe('getTerm', () => {
            it('should return the state term', () => {
                expect(fromFilter.getTerm(snapshot)).toBe(snapshot.term);
            });
        });
    });
});
