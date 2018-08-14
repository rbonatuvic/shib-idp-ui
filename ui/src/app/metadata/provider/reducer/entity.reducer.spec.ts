import { reducer, initialState as snapshot, isEntitySaved } from './entity.reducer';
import { EntityActionTypes, ClearProvider } from '../action/entity.action';
import { MetadataProvider } from '../../domain/model';
import {
    ProviderCollectionActionTypes,
    UpdateProviderRequest,
    AddProviderRequest,
    UpdateProviderSuccess,
    UpdateProviderFail,
    AddProviderFail,
    AddProviderSuccess
} from '../action/collection.action';

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

    describe(`${ProviderCollectionActionTypes.UPDATE_PROVIDER_REQUEST}`, () => {
        it('should set to `saving`', () => {
            expect(reducer(snapshot, new UpdateProviderRequest(<MetadataProvider>{})).saving).toBe(true);
        });
    });

    describe(`${ProviderCollectionActionTypes.ADD_PROVIDER_REQUEST}`, () => {
        it('should set to `saving`', () => {
            expect(reducer(snapshot, new AddProviderRequest(<MetadataProvider>{})).saving).toBe(true);
        });
    });

    describe(`${ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS}`, () => {
        it('should set to not `saving`', () => {
            expect(reducer(snapshot, new UpdateProviderSuccess({id: 'foo', changes: <MetadataProvider>{} })).saving).toBe(false);
        });
    });

    describe(`${ProviderCollectionActionTypes.ADD_PROVIDER_FAIL}`, () => {
        it('should set to not `saving`', () => {
            expect(reducer(snapshot, new AddProviderFail(<MetadataProvider>{})).saving).toBe(false);
        });
    });

    describe(`${ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS}`, () => {
        it('should set to not `saving`', () => {
            expect(reducer(snapshot, new AddProviderSuccess(<MetadataProvider>{})).saving).toBe(false);
        });
    });

    describe(`${ProviderCollectionActionTypes.UPDATE_PROVIDER_FAIL}`, () => {
        it('should set to not `saving`', () => {
            expect(reducer(snapshot, new UpdateProviderFail(<MetadataProvider>{})).saving).toBe(false);
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
