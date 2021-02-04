import * as fromIndex from './index';
import * as fromUser from './user.reducer';
import * as fromVersion from './version.reducer';
import * as fromLocation from './location.reducer';
import * as fromConfig from './configuration.reducer';
import { VersionInfo } from '../model/version';

describe('Core index reducers', () => {
    const state: fromIndex.CoreState = {
        user: fromUser.initialState as fromUser.UserState,
        version: fromVersion.initialState as fromVersion.VersionState,
        config: fromConfig.initialState as fromConfig.ConfigState,
        location: fromLocation.initialState as fromLocation.LocationState
    };
    describe('getUserStateFn function', () => {
        it('should return the user state', () => {
            expect(fromIndex.getUserStateFn(state)).toEqual(state.user);
        });
    });
    describe('getVersionStateFn function', () => {
        it('should return the version state', () => {
            expect(fromIndex.getVersionStateFn(state)).toEqual(state.version);
        });
    });
    describe('getConfigStateFn function', () => {
        it('should return the config state', () => {
            expect(fromIndex.getConfigStateFn(state)).toEqual(state.config);
        });
    });
    describe('filterRolesFn', () => {
        it('should return the roles that are not `non roles`', () => {
            expect(fromIndex.filterRolesFn(['ROLE_ADMIN', 'ROLE_NONE'])).toEqual(['ROLE_ADMIN']);
        });
    });
    describe('isUserAdminFn', () => {
        it('should check if the provided user has the ROLE_ADMIN role', () => {
            expect(fromIndex.isUserAdminFn({role: 'ROLE_ADMIN'})).toBe(true);
            expect(fromIndex.isUserAdminFn({role: 'ROLE_USER'})).toBe(false);
            expect(fromIndex.isUserAdminFn(null)).toBe(false);
        });
    });
});
