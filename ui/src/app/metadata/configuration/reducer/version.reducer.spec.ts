import {
    reducer,
    getVersionModel,
    getVersionModelLoaded,
    getSelectedMetadataId,
    getSelectedVersionId,
    getSelectedVersionType
} from './version.reducer';
import * as fromVersion from './version.reducer';
import {
    VersionActionTypes,
    SelectVersionRequest,
    ClearVersion,
    SelectVersionSuccess
} from '../action/version.action';
import { Metadata } from '../../domain/domain.type';
import { VersionRequest } from '../model/request';

describe('Restore Reducer', () => {

    let baseState;

    const req: VersionRequest = {
        type: 'provider',
        version: 'foo',
        id: 'bar'
    };

    const model: Metadata = {
        id: 'bar',
        name: 'foo',
        '@type': 'MetadataProvider',
        type: 'provider',
        resourceId: 'foo',
        createdBy: 'bar'
    };

    beforeEach(() => {
        baseState = { ...fromVersion.initialState };
    });

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(baseState);
        });
    });

    describe(`${VersionActionTypes.SELECT_VERSION_REQUEST} action`, () => {
        it('should set the needed metadata properties', () => {
            const action = new SelectVersionRequest(req);
            const result = reducer(baseState, action);

            expect(result.selectedMetadataId).toEqual(req.id);
        });
    });

    describe(`${VersionActionTypes.SELECT_VERSION_SUCCESS} action`, () => {
        it('should set the needed metadata properties', () => {
            const action = new SelectVersionSuccess(model as Metadata);
            const result = reducer(baseState, action);

            expect(result).toEqual({ ...baseState, model, loaded: true });
        });
    });

    describe(`${VersionActionTypes.CLEAR_VERSION} action`, () => {
        it('should set the needed metadata properties', () => {
            const action = new ClearVersion();
            const result = reducer(baseState, action);

            expect(result).toEqual(baseState);
        });
    });

    describe('selector function', () => {
        describe('getSelectedMetadataId', () => {
            it('should return the selected version id', () => {
                expect(getVersionModel({ ...baseState, model })).toEqual(model);
            });
        });

        describe('getSelectedMetadataVersion', () => {
            it('should return the selected version id', () => {
                expect(getVersionModelLoaded({ ...baseState, loaded: true })).toBe(true);
            });
        });

        describe('getSelectedMetadataId', () => {
            it('should return the selected resource id', () => {
                expect(getSelectedMetadataId({ ...baseState, selectedMetadataId: req.id})).toEqual(req.id);
            });
        });

        describe('getSelectedMetadataType', () => {
            it('should return the selected version type', () => {
                expect(getSelectedVersionType({ ...baseState, selectedVersionType: req.type })).toEqual(req.type);
            });
        });

        describe('getSelectedMetadataType', () => {
            it('should return the selected version id', () => {
                expect(getSelectedVersionId({ ...baseState, selectedVersionId: req.version })).toEqual(req.version);
            });
        });
    });
});
