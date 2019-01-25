import { reducer } from './user.reducer';
import * as fromUser from './user.reducer';
import * as actions from '../action/user.action';
import { User } from '../model/user';

describe('User Reducer', () => {
    const initialState: fromUser.UserState = {
        fetching: false,
        user: null,
        error: null
    };

    const user: User = {
        username: 'foo',
        role: 'admin',
        firstName: 'foo',
        lastName: 'bar',
        emailAddress: 'foo@bar.com'
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);
            expect(result).toEqual(initialState);
        });
    });

    describe('User Load Request', () => {
        it('should set fetching to true', () => {
            const action = new actions.UserLoadRequestAction();
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, { fetching: true })
            );
        });
    });

    describe('User Load Success', () => {
        it('should update the user', () => {
            const action = new actions.UserLoadSuccessAction(user);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, { user: user })
            );
        });
    });

    describe('User Load Error', () => {
        it('should store the error message', () => {
            const error = { message: 'Failed', type: '404' };
            const action = new actions.UserLoadErrorAction(error);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, { error: error })
            );
        });
    });

    describe('User Selectors', () => {
        const state = {
            user: { ...user },
            fetching: true,
            error: { message: 'foo', type: 'bar' }
        } as fromUser.UserState;

        it('should select the user', () => {
            expect(fromUser.getUser(state)).toEqual(state.user);
        });
        it('should select the fetching state', () => {
            expect(fromUser.isFetching(state)).toEqual(state.fetching);
        });
        it('should select the user', () => {
            expect(fromUser.getError(state)).toEqual(state.error);
        });
    });
});
