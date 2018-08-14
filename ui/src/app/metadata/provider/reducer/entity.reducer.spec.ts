import { reducer, initialState as snapshot, isEntitySaved } from './entity.reducer';
import { EntityActionTypes, ClearProvider } from '../action/entity.action';
import { MetadataProvider } from '../../domain/model';

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

    describe(`isEntitySaved method`, () => {
        it('should return false if there are changes', () => {
            expect(isEntitySaved({
                ...snapshot,
                changes: <MetadataProvider>{
                    name: 'bar'
                }
            })).toBe(false);
        });

        it('should return true if there are no changes', () => {
            expect(isEntitySaved({
                ...snapshot,
                changes: <MetadataProvider>{}
            })).toBe(true);
        });
    });
});
