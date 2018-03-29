import { reducer } from './version.reducer';
import * as fromVersion from './version.reducer';
import * as actions from '../action/version.action';
import { VersionInfo } from '../model/version';

describe('Version Reducer', () => {
    const initialState: fromVersion.VersionState = {
        info: {},
        loading: false,
        error: null
    };

    const version: VersionInfo = {
        git: {
            commit: {
                time: '2018-03-28T20:14:36Z',
                id: '40aff48'
            },
            branch: 'feature/SHIBUI-285'
        },
        build: {
            version: '1.0.0',
            artifact: 'shibui',
            name: 'master',
            group: 'foo',
            time: '2018-03-29T14:51:38.975Z'
        }
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);
            expect(result).toEqual(initialState);
        });
    });

    describe('Version Load Request', () => {
        it('should set loading to true', () => {
            const action = new actions.VersionInfoLoadRequestAction();
            const result = reducer(initialState, action);
            expect(result.loading).toBe(true);
        });
    });

    describe('Version Load Success', () => {
        it('should set loading to false', () => {
            const action = new actions.VersionInfoLoadSuccessAction(version);
            const result = reducer(initialState, action);
            expect(result.loading).toBe(false);
        });

        it('should set the version data to the payload', () => {
            const action = new actions.VersionInfoLoadSuccessAction(version);
            const result = reducer(initialState, action);
            expect(result.info).toEqual(version);
        });
    });

    describe('Version Load Success', () => {
        it('should set loading to false', () => {
            const action = new actions.VersionInfoLoadErrorAction(new Error());
            const result = reducer(initialState, action);
            expect(result.loading).toBe(false);
        });

        it('should add an error to state', () => {
            const err = new Error('fail!');
            const action = new actions.VersionInfoLoadErrorAction(err);
            const result = reducer(initialState, action);
            expect(result.error).toEqual(err);
        });
    });

    describe('getVersionInfo selector', () => {
        it('should return the version info from state', () => {
            const action = new actions.VersionInfoLoadSuccessAction(version);
            const result = reducer(initialState, action);
            expect(fromVersion.getVersionInfo(result)).toEqual(version);
        });
    });

    describe('getError selector', () => {
        it('should return the version error from state', () => {
            const err = new Error('fail');
            const action = new actions.VersionInfoLoadErrorAction(err);
            const result = reducer(initialState, action);
            expect(fromVersion.getVersionError(result)).toEqual(err);
        });
    });

    describe('getLoading selector', () => {
        it('should return the version loading status from state', () => {
            const action = new actions.VersionInfoLoadRequestAction();
            const result = reducer(initialState, action);
            expect(fromVersion.getVersionIsLoading(result)).toBe(true);
        });
    });
});
