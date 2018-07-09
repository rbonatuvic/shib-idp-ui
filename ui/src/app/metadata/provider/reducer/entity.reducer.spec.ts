import { reducer, initialState as snapshot } from './entity.reducer';
import { EntityActionTypes, ClearProvider } from '../action/entity.action';

describe('Provider Editor Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${EntityActionTypes.CLEAR_PROVIDER}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new ClearProvider())).toEqual(snapshot);
        });
    });
});
