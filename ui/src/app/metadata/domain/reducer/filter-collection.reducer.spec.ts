import { reducer } from './filter-collection.reducer';
import * as fromFilter from './filter-collection.reducer';
import {
    FilterCollectionActionTypes,
    LoadFilterSuccess,
    UpdateFilterSuccess,
    SelectFilter
} from '../action/filter-collection.action';
import { EntityAttributesFilter } from '../entity/entity-attributes.filter';

const snapshot: fromFilter.FilterCollectionState = {
    ids: [],
    entities: {},
    selectedFilterId: null,
    loaded: false
};

describe('Filter Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${FilterCollectionActionTypes.SELECT}`, () => {
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
                new EntityAttributesFilter({ id: 'foo', createdDate: new Date().toLocaleDateString() }),
                new EntityAttributesFilter({ id: 'bar', createdDate: new Date().toLocaleDateString() })
            ];
            const action = new LoadFilterSuccess(filters);
            const result = reducer(snapshot, action);
            expect(fromFilter.adapter.addAll).toHaveBeenCalled();
        });
    });

    describe(`${FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS}`, () => {
        it('should add the loaded filters to the collection', () => {
            spyOn(fromFilter.adapter, 'updateOne').and.callThrough();
            const update = {
                id: 'foo',
                changes: new EntityAttributesFilter({ id: 'foo', name: 'bar', createdDate: new Date().toLocaleDateString() }),
            };
            const action = new UpdateFilterSuccess(update);
            const result = reducer(snapshot, action);
            expect(fromFilter.adapter.updateOne).toHaveBeenCalled();
        });
    });
});
