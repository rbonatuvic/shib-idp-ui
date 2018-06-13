import { reducer } from './filter.reducer';
import * as fromFilter from './filter.reducer';
import * as actions from '../action/filter.action';
import * as searchActions from '../action/search.action';
import {
    SelectId,
    LoadEntityPreviewSuccess,
    UpdateFilterChanges,
    CancelCreateFilter
} from '../action/filter.action';

import {
    ClearSearch
} from '../action/search.action';

import {
    FilterCollectionActionsUnion,
    FilterCollectionActionTypes,
    AddFilterRequest,
    UpdateFilterRequest,
    AddFilterSuccess,
    UpdateFilterSuccess
} from '../../domain/action/filter-collection.action';
import { MDUI } from '../../domain/model/mdui';
import { MetadataFilter } from '../../domain/domain.type';
import { Filter } from '../../domain/entity/filter';

const snapshot: fromFilter.FilterState = {
    selected: null,
    changes: null,
    preview: null,
    saving: false
};

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

    describe(`${actions.SELECT_ID} action`, () => {
        it('should set selected property to the provided payload', () => {
            const id = 'foo';
            const result = reducer(snapshot, new actions.SelectId(id));
            expect(result.selected).toBe(id);
        });
    });

    describe(`${actions.LOAD_ENTITY_PREVIEW_SUCCESS} action`, () => {
        it('should set preview property to the provided payload', () => {
            let sampleMdui = { ...mdui };
            const result = reducer(snapshot, new actions.LoadEntityPreviewSuccess(sampleMdui));
            expect(result.preview).toEqual(sampleMdui);
        });
    });

    describe(`${actions.UPDATE_FILTER} action`, () => {
        it('should update the state of changes', () => {
            const changes = { filterEnabled: false };
            const current = { ...snapshot, changes: { filterEnabled: true } as MetadataFilter };
            const result = reducer(current, new actions.UpdateFilterChanges(changes));
            expect(result.changes.filterEnabled).toBe(false);
        });
    });

    describe(`${FilterCollectionActionTypes.ADD_FILTER} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new AddFilterRequest(new Filter()));
            expect(result.saving).toBe(true);
        });
    });
    describe(`${FilterCollectionActionTypes.UPDATE_FILTER_REQUEST} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new UpdateFilterRequest(new Filter()));
            expect(result.saving).toBe(true);
        });
    });

    describe(`${FilterCollectionActionTypes.ADD_FILTER_SUCCESS} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new AddFilterSuccess(new Filter()));
            expect(result).toEqual(fromFilter.initialState);
        });
    });
    describe(`${FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS} action`, () => {
        it('should set saving to true', () => {
            const update = {id: 'foo', changes: new Filter({id: 'foo'})};
            const result = reducer(snapshot, new UpdateFilterSuccess(update));
            expect(result).toEqual(fromFilter.initialState);
        });
    });
    describe(`${searchActions.CLEAR_SEARCH} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new ClearSearch());
            expect(result).toEqual(fromFilter.initialState);
        });
    });
    describe(`${actions.CANCEL_CREATE_FILTER} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new CancelCreateFilter());
            expect(result).toEqual(fromFilter.initialState);
        });
    });
});
