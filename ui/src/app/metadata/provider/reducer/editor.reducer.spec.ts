import { reducer, initialState as snapshot } from './editor.reducer';
import { EditorActionTypes, ClearEditor } from '../action/editor.action';

describe('Provider Editor Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${EditorActionTypes.CLEAR}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new ClearEditor())).toEqual(snapshot);
        });
    });
});
