import { reducer } from './configuration.reducer';
import * as fromConfiguration from './configuration.reducer';
import * as actions from '../action/configuration.action';

describe('Configuration Reducer', () => {
    const initialState: fromConfiguration.ConfigState = {
        roles: []
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);
            expect(result).toEqual(initialState);
        });
    });

    describe('Role Load Request', () => {
        it('should set fetching to true', () => {
            const action = new actions.LoadRoleSuccess(['ADMIN']);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                {
                    ...initialState,
                    roles: ['ADMIN']
                }
            );
        });
    });

    describe('selector functions', () => {
        it('should return the roles from state', () => {
            expect(fromConfiguration.getRoles(initialState)).toEqual([]);
        });
    });
});
