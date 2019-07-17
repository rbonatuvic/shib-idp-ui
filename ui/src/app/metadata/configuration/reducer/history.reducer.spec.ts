import { reducer } from './history.reducer';
import * as fromHistory from './history.reducer';
import * as actions from '../action/history.action';
import { MetadataHistory } from '../model/history';

describe('History Reducer', () => {

    const baseState = fromHistory.initialState;

    const history: MetadataHistory = {
        versions: [
            {
                id: '1',
                date: new Date().toLocaleDateString(),
                creator: 'foo'
            },
            {
                id: '2',
                date: new Date().toDateString(),
                creator: 'foo'
            }
        ]
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(fromHistory.initialState);
        });
    });

    describe('SET_HISTORY action', () => {
        it('should set the state metadata model', () => {
            const action = new actions.SetHistory(history);
            const result = reducer(fromHistory.initialState, action);

            expect(Object.keys(result.entities)).toEqual(['1', '2']);
        });
    });

    describe('SELECT_VERSION action', () => {
        it('should set the state metadata model', () => {
            const action = new actions.SelectVersion('1');
            const result = reducer(baseState, action);

            expect(result).toEqual({ ...baseState, selectedVersionId: '1' });
        });
    });

    describe('CLEAR action', () => {
        it('should clear the state and reset to initial state', () => {
            const action = new actions.ClearHistory();
            const result = reducer({
                ...baseState,
                ...history
            }, action);

            expect(result).toEqual(baseState);
        });
    });

    describe('selector functions', () => {
        describe('getSelectedId', () => {
            it('should return the selected version id', () => {
                expect(fromHistory.getSelectedVersionId({ ...baseState, selectedVersionId: '1' })).toBe('1');
            });
        });
    });
});
