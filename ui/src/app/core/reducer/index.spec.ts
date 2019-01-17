import * as fromIndex from './index';
import * as fromUser from './user.reducer';
import * as fromVersion from './version.reducer';
import * as fromConfig from './configuration.reducer';
import { VersionInfo } from '../model/version';

describe('Core index reducers', () => {
    const state: fromIndex.CoreState = {
        user: fromUser.initialState as fromUser.UserState,
        version: fromVersion.initialState as fromVersion.VersionState,
        config: fromConfig.initialState as fromConfig.ConfigState
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
});
