import { reducer } from './dashboard.reducer';
import * as fromDashboard from './dashboard.reducer';
import { ToggleEntityDisplay } from '../action/dashboard.action';

describe('Dashboard Reducer', () => {
    const initialState: fromDashboard.State = {
        providersOpen: {}
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(initialState);
        });
    });

    describe('Toggle Resolver Display', () => {
        it('should toggle the selected providers open state', () => {
            const id = 'foo';
            const action = new ToggleEntityDisplay(id);

            const result = reducer(initialState, action);

            expect(result).toEqual(
                Object.assign({}, initialState, { providersOpen: { foo: true } })
            );
        });
    });
});
