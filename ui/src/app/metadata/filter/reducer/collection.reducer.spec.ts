import { reducer, initialState as snapshot } from './collection.reducer';
import * as fromFilter from './collection.reducer';
import {
    FilterCollectionActionTypes,
    LoadFilterSuccess,
    UpdateFilterSuccess,
    SelectFilter,
    SelectFilterSuccess,
    AddFilterRequest,
    UpdateFilterRequest,
    AddFilterSuccess,
    AddFilterFail,
    UpdateFilterFail,
    RemoveFilterFail,
    RemoveFilterRequest,
    RemoveFilterSuccess
} from '../action/collection.action';
import { EntityAttributesFilterEntity } from '../../domain/entity/filter/entity-attributes-filter';

describe('Filter Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${FilterCollectionActionTypes.SELECT_FILTER_REQUEST}`, () => {
        it('should set the selected id in the store', () => {
            const selectedFilterId = 'foo';
            const action = new SelectFilter(selectedFilterId);
            const result = reducer(snapshot, action);
            expect(result).toEqual({...snapshot, selectedFilterId});
        });
    });

    describe(`${FilterCollectionActionTypes.LOAD_FILTER_SUCCESS}`, () => {
        it('should add the loaded filters to the collection', () => {
            spyOn(fromFilter.adapter, 'addAll').and.callThrough();
            const filters = [
                new EntityAttributesFilterEntity({ resourceId: 'foo', createdDate: new Date().toLocaleDateString() }),
                new EntityAttributesFilterEntity({ resourceId: 'bar', createdDate: new Date().toLocaleDateString() })
            ];
            const action = new LoadFilterSuccess(filters);
            const result = reducer(snapshot, action);
            expect(fromFilter.adapter.addAll).toHaveBeenCalled();
        });
    });

    describe(`${FilterCollectionActionTypes.SELECT_FILTER_SUCCESS}`, () => {
        it('should add the loaded filter to the collection', () => {
            spyOn(fromFilter.adapter, 'addOne').and.callThrough();
            const filter = new EntityAttributesFilterEntity({ resourceId: 'foo', createdDate: new Date().toLocaleDateString() });
            const action = new SelectFilterSuccess(filter);
            const result = reducer(snapshot, action);
            expect(fromFilter.adapter.addOne).toHaveBeenCalled();
        });
    });

    describe(`${FilterCollectionActionTypes.ADD_FILTER_REQUEST}`, () => {
        it('should set saving to true', () => {
            const filter = new EntityAttributesFilterEntity({ resourceId: 'foo', createdDate: new Date().toLocaleDateString() });
            const action = new AddFilterRequest({
                filter,
                providerId: 'foo'
            });
            expect(reducer(snapshot, action).saving).toBe(true);
        });
    });
    describe(`${FilterCollectionActionTypes.UPDATE_FILTER_REQUEST}`, () => {
        it('should set saving to true', () => {
            const filter = new EntityAttributesFilterEntity({ resourceId: 'foo', createdDate: new Date().toLocaleDateString() });
            const action = new UpdateFilterRequest({
                filter,
                providerId: 'foo'
            });
            expect(reducer(snapshot, action).saving).toBe(true);
        });
    });

    describe(`${FilterCollectionActionTypes.ADD_FILTER_SUCCESS}`, () => {
        it('should set saving to false', () => {
            const filter = new EntityAttributesFilterEntity({ resourceId: 'foo', createdDate: new Date().toLocaleDateString() });
            const action = new AddFilterSuccess({
                filter,
                providerId: 'foo'
            });
            expect(reducer(snapshot, action).saving).toBe(false);
        });
    });

    describe(`${FilterCollectionActionTypes.ADD_FILTER_FAIL}`, () => {
        it('should set saving to false', () => {
            const action = new AddFilterFail(new Error('error'));
            expect(reducer(snapshot, action).saving).toBe(false);
        });
    });

    describe(`${FilterCollectionActionTypes.UPDATE_FILTER_FAIL}`, () => {
        it('should set saving to false', () => {
            const filter = new EntityAttributesFilterEntity({ resourceId: 'foo', createdDate: new Date().toLocaleDateString() });
            const action = new UpdateFilterFail(filter);
            expect(reducer(snapshot, action).saving).toBe(false);
        });
    });

    describe(`${FilterCollectionActionTypes.REMOVE_FILTER_FAIL}`, () => {
        it('should set saving to false', () => {
            const action = new RemoveFilterFail(new Error('foo'));
            expect(reducer(snapshot, action).saving).toBe(false);
        });
    });

    describe(`${FilterCollectionActionTypes.REMOVE_FILTER_REQUEST}`, () => {
        it('should set saving to false', () => {
            const action = new RemoveFilterRequest('foo');
            expect(reducer(snapshot, action).saving).toBe(true);
        });
    });

    describe(`${FilterCollectionActionTypes.REMOVE_FILTER_SUCCESS}`, () => {
        it('should set saving to false', () => {
            const action = new RemoveFilterSuccess('foo');
            expect(reducer(snapshot, action).saving).toBe(false);
        });
    });

    describe(`${FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS}`, () => {
        it('should update the filter in the collection', () => {
            spyOn(fromFilter.adapter, 'updateOne').and.callThrough();
            const update = {
                id: 'foo',
                changes: new EntityAttributesFilterEntity({ resourceId: 'foo', name: 'bar', createdDate: new Date().toLocaleDateString() }),
            };
            const action = new UpdateFilterSuccess({
                update,
                providerId: 'foo'
            });
            const result = reducer(snapshot, action);
            expect(fromFilter.adapter.updateOne).toHaveBeenCalled();
        });
    });

    describe('selector methods', () => {
        describe('getSelectedFilterId', () => {
            it('should return the state selectedFilterId', () => {
                expect(fromFilter.getSelectedFilterId(snapshot)).toBe(snapshot.selectedFilterId);
            });
        });

        describe('getIsLoaded', () => {
            it('should return the state loaded', () => {
                expect(fromFilter.getIsLoaded(snapshot)).toBe(snapshot.loaded);
            });
        });

        describe('getError', () => {
            it('should return the state saving', () => {
                expect(fromFilter.getIsSaving(snapshot)).toBe(snapshot.saving);
            });
        });

        describe('getOrder', () => {
            it('should return the state order', () => {
                expect(fromFilter.getOrder(snapshot)).toBe(snapshot.order);
            });
        });
    });
});
