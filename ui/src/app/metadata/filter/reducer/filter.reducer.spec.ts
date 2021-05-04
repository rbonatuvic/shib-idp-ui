import { reducer, initialState as snapshot } from './filter.reducer';
import * as fromFilter from './filter.reducer';
import { SelectId, LoadEntityPreviewSuccess, UpdateFilterChanges, FilterActionTypes, CancelCreateFilter } from '../action/filter.action';
import { MDUI } from '../../domain/model';
import { MetadataFilter } from '../../domain/model';

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
    describe(`${FilterActionTypes.CANCEL_CREATE_FILTER} action`, () => {
        it('should set saving to true', () => {
            const result = reducer(snapshot, new CancelCreateFilter('foo'));
            expect(result).toEqual(fromFilter.initialState);
        });
    });

    describe('selector methods', () => {
        describe('getSelected', () => {
            it('should return the state selected', () => {
                expect(fromFilter.getSelected(snapshot)).toBe(snapshot.selected);
            });
        });

        describe('getChanges', () => {
            it('should return the state changes', () => {
                expect(fromFilter.getFilterChanges(snapshot)).toBe(snapshot.changes);
            });
        });

        describe('getPreview', () => {
            it('should return the state preview', () => {
                expect(fromFilter.getPreview(snapshot)).toBe(snapshot.preview);
            });
        });
    });
});
