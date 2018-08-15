import { reducer, initialState as snapshot } from './filter.reducer';
import * as fromFilter from './filter.reducer';
import { SelectId, LoadEntityPreviewSuccess, UpdateFilterChanges, FilterActionTypes, CancelCreateFilter } from '../action/filter.action';
import { SearchActionTypes } from '../action/search.action';

import {
    ClearSearch
} from '../action/search.action';

import {
    FilterCollectionActionTypes,
    AddFilterRequest,
    UpdateFilterRequest,
    AddFilterSuccess,
    UpdateFilterSuccess
} from '../action/collection.action';
import { MDUI } from '../../domain/model';
import { MetadataFilter } from '../../domain/model';
import { EntityAttributesFilterEntity } from '../../domain/entity/filter/entity-attributes-filter';

const mdui: MDUI = {
    displayName: 'foo',
    informationUrl: 'bar',
    privacyStatementUrl: 'baz',
    logoUrl: '',
    logoHeight: 100,
    logoWidth: 100,
    description: '',
};

describe('Filter Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${FilterActionTypes.SELECT_ID} action`, () => {
        it('should set selected property to the provided payload', () => {
            const id = 'foo';
            const result = reducer(snapshot, new SelectId(id));
            expect(result.selected).toBe(id);
        });
    });

    describe(`${FilterActionTypes.LOAD_ENTITY_PREVIEW_SUCCESS} action`, () => {
        it('should set preview property to the provided payload', () => {
            let sampleMdui = { ...mdui };
            const result = reducer(snapshot, new LoadEntityPreviewSuccess(sampleMdui));
            expect(result.preview).toEqual(sampleMdui);
        });
    });

    describe(`${FilterActionTypes.UPDATE_FILTER} action`, () => {
        it('should update the state of changes', () => {
            const changes = { filterEnabled: false };
            const current = { ...snapshot, changes: { filterEnabled: true } as MetadataFilter };
            const result = reducer(current, new UpdateFilterChanges(changes));
            expect(result.changes.filterEnabled).toBe(false);
        });
    });

    describe(`${FilterCollectionActionTypes.ADD_FILTER_SUCCESS} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new AddFilterSuccess(new EntityAttributesFilterEntity()));
            expect(result).toEqual(fromFilter.initialState);
        });
    });
    describe(`${FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS} action`, () => {
        it('should set saving to true', () => {
            const update = {id: 'foo', changes: new EntityAttributesFilterEntity({id: 'foo'})};
            const result = reducer(snapshot, new UpdateFilterSuccess(update));
            expect(result).toEqual(fromFilter.initialState);
        });
    });
    describe(`${SearchActionTypes.CLEAR_SEARCH} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new ClearSearch());
            expect(result).toEqual(fromFilter.initialState);
        });
    });
    describe(`${FilterActionTypes.CANCEL_CREATE_FILTER} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new CancelCreateFilter());
            expect(result).toEqual(fromFilter.initialState);
        });
    });
});
