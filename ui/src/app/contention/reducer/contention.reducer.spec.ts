import { reducer, initialState as snapshot, getContention } from './contention.reducer';
import { ContentionActionTypes, ShowContentionAction, ResolveContentionAction, CancelContentionAction } from '../action/contention.action';

describe('Contention Reducer', () => {

    const contention = {
        base: {},
        ours: {},
        theirs: {},

        rejectionObject: {},
        resolutionObject: {},

        ourChanges: {},
        theirChanges: {},

        handlers: {
            resolve: (value: {}) => ({}),
            reject: (value: {}) => ({})
        }
    };

    const populated = { ...snapshot, contention: { ...contention } };

    const resolution = { value: contention.ours, handlers: contention.handlers };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${ContentionActionTypes.SHOW_CONTENTION}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new ShowContentionAction(contention))).toEqual(populated);
        });
    });

    describe(`${ContentionActionTypes.RESOLVE_CONTENTION}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new ResolveContentionAction(resolution))).toEqual(snapshot);
        });
    });

    describe(`${ContentionActionTypes.CANCEL_CONTENTION}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new CancelContentionAction(resolution))).toEqual(snapshot);
        });
    });

    describe(`getContention method`, () => {
        it('should return the contention object from the state', () => {
            expect(getContention(snapshot)).toBe(snapshot.contention);
            expect(getContention(populated)).toEqual(contention);
        });
    });
});
