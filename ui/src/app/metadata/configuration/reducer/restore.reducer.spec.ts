import { reducer } from './restore.reducer';
import * as fromRestore from './restore.reducer';
import * as actions from '../action/restore.action';

describe('Restore Reducer', () => {

    const baseState = fromRestore.initialState;

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(fromRestore.initialState);
        });
    });

    describe('SET_HISTORY action', () => {
        it('should set the state metadata model', () => {
            const serviceEnabled = true;
            const action = new actions.UpdateRestorationChangesSuccess({ serviceEnabled });
            const result = reducer(fromRestore.initialState, action);

            expect(Object.keys(result.changes)).toEqual({serviceEnabled: true});
        });
    });

    describe('selector function', () => {
        describe('getChanges', () => {
            it('should return the selected version id', () => {
                expect(fromRestore.getChanges({ ...baseState, serviceEnabled: false })).toEqual({ serviceEnabled: false });
            });
        });
    });
});
