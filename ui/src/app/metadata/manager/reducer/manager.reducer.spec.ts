import { reducer } from './manager.reducer';
import * as fromDashboard from './manager.reducer';
import { ToggleEntityDisplay } from '../action/manager.action';

describe('Dashboard Reducer', () => {
    const initialState: fromDashboard.State = {
        resolversOpen: {}
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
