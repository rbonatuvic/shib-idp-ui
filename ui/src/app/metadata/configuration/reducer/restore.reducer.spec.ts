import { reducer } from './restore.reducer';
import * as fromRestore from './restore.reducer';
import {
    RestoreActionTypes,
    RestoreActionsUnion,
    UpdateRestorationChangesSuccess,
    SetSavingStatus,
    UpdateRestoreFormStatus
} from '../action/restore.action';
import { Metadata } from '../../domain/domain.type';

describe('Restore Reducer', () => {

    const baseState = fromRestore.initialState;

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(fromRestore.initialState);
        });
    });

    describe(`${RestoreActionTypes.UPDATE_RESTORATION_SUCCESS} action`, () => {
        it('should set the state metadata model', () => {
            const serviceEnabled = true;
            const action = new UpdateRestorationChangesSuccess({ serviceEnabled });
            const result = reducer(fromRestore.initialState, action);

            expect(result.changes).toEqual({serviceEnabled} as Metadata);
        });
    });

    describe(`${RestoreActionTypes.SET_SAVING_STATUS} action`, () => {
        it('should set the state saving status', () => {
            const action = new SetSavingStatus(true);
            const result = reducer(fromRestore.initialState, action);

            expect(result.saving).toBe(true);
        });
    });

    describe(`${RestoreActionTypes.UPDATE_STATUS} action`, () => {
        it('should set the state saving status', () => {
            const action = new UpdateRestoreFormStatus({foo: 'INVALID'});
            const result = reducer(fromRestore.initialState, action);

            expect(result.status.foo).toBe('INVALID');
        });
    });

    describe('selector function', () => {
        describe('getChanges', () => {
            it('should return the selected version id', () => {
                expect(fromRestore.getChanges({ ...baseState, changes: { serviceEnabled: false } })).toEqual({ serviceEnabled: false });
            });
        });

        describe('isRestorationSaved', () => {
            it('should return false if there are outstanding changes', () => {
                expect(fromRestore.isRestorationSaved({ ...baseState, changes: { name: 'too' } })).toBe(false);
            });

            it('should return true if there are no outstanding changes', () => {
                expect(fromRestore.isRestorationSaved({ ...baseState, changes: {} })).toBe(true);
            });
        });

        describe('getFormStatus', () => {
            it('should return the current form status', () => {
                expect(fromRestore.getFormStatus({ ...baseState, status: { common: 'INVALID' } })).toEqual({ common: 'INVALID' });
            });
        });

        describe('isRestorationSaving', () => {
            it('should return the saving status', () => {
                expect(fromRestore.isRestorationSaving({ ...baseState })).toBe(false);
                expect(fromRestore.isRestorationSaving({ ...baseState, saving: true })).toBe(true);
            });
        });

        describe('isRestorationValid', () => {
            it('should return false if any forms have an invalid status', () => {
                expect(fromRestore.isRestorationValid({ ...baseState, status: { common: 'INVALID' } })).toBe(false);
            });

            it('should return true if all forms have a valid status', () => {
                expect(fromRestore.isRestorationValid({ ...baseState, status: { common: 'VALID' } })).toBe(true);
            });
        });

        describe('getInvalidRestorationForms', () => {
            it('should return the form names that are invalid', () => {
                expect(fromRestore.getInvalidRestorationForms({ ...baseState, status: { common: 'INVALID' } })).toEqual(['common']);
            });
        });
    });
});
