import { reducer } from './copy.reducer';
import * as fromProviderCopy from './copy.reducer';
import * as actions from '../action/copy.action';
import * as fromCollection from '../../domain/action/provider-collection.action';
import { CopySourceActionTypes, CopySourceActionUnion, CreateProviderCopyRequest } from '../action/copy.action';
import { Resolver } from '../../domain/entity/provider';

const snapshot: fromProviderCopy.CopyState = { ...fromProviderCopy.initialState };

describe('Resolver -> Copy Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);
            expect(result).toEqual(snapshot);
        });
    });

    describe(`${CopySourceActionTypes.CREATE_PROVIDER_COPY_REQUEST} action`, () => {
        it('should set properties on the state', () => {
            const obj = { ...snapshot };
            const result = reducer(snapshot, new CreateProviderCopyRequest(obj));

            expect(result).toEqual(obj);
        });
    });

    describe(`${CopySourceActionTypes.CREATE_PROVIDER_COPY_SUCCESS} action`, () => {
        it('should set properties on the state', () => {
            const p = new Resolver({});
            const obj = { ...snapshot };
            const result = reducer(snapshot, new actions.CreateProviderCopySuccess(p));

            expect(result.provider).toBe(p);
        });
    });

    describe(`${CopySourceActionTypes.CREATE_PROVIDER_COPY_ERROR} action`, () => {
        it('should set properties on the state', () => {
            const p = new Resolver({});
            const obj = { ...snapshot };
            const result = reducer(snapshot, new actions.CreateProviderCopyError(new Error()));

            expect(result.provider).toBeNull();
        });
    });

    describe(`${CopySourceActionTypes.UPDATE_PROVIDER_COPY} action`, () => {
        it('should set properties on the state', () => {
            const obj = { ...snapshot, provider: new Resolver({}) };
            const result = reducer(snapshot, new actions.UpdateProviderCopy({id: 'foo'}));

            expect(result.provider.id).toBe('foo');
        });
    });

    describe(`${ fromCollection.ProviderCollectionActionTypes.ADD_PROVIDER } action`, () => {
        it('should set properties on the state', () => {
            const p = new Resolver({});
            const obj = { ...snapshot, provider: p };
            const result = reducer(snapshot, new fromCollection.AddProviderRequest(p));

            expect(result.saving).toBe(true);
        });
    });

    describe(`${fromCollection.ProviderCollectionActionTypes.ADD_PROVIDER_SUCCESS} action`, () => {
        it('should set properties on the state', () => {
            const p = new Resolver({});
            const obj = { ...snapshot, provider: p };
            const result = reducer(snapshot, new fromCollection.AddProviderSuccess(p));

            expect(result.saving).toBe(false);
        });
    });

    describe(`${fromCollection.ProviderCollectionActionTypes.ADD_PROVIDER_FAIL} action`, () => {
        it('should set properties on the state', () => {
            const p = new Resolver({});
            const obj = { ...snapshot, provider: p };
            const result = reducer(snapshot, new fromCollection.AddProviderFail(p));

            expect(result.saving).toBe(false);
        });
    });

    describe(`getCopy selector function`, () => {
        it('should return the entire copy object', () => {
            expect(fromProviderCopy.getCopy(snapshot)).toBe(snapshot.provider);
        });
    });
    describe(`getEntityId selector function`, () => {
        it('should return the entityId property', () => {
            expect(fromProviderCopy.getEntityId(snapshot)).toBe(snapshot.entityId);
        });
    });
    describe(`getName selector function`, () => {
        it('should return the serviceProviderName property', () => {
            expect(fromProviderCopy.getName(snapshot)).toBe(snapshot.serviceProviderName);
        });
    });
    describe(`getTarget selector function`, () => {
        it('should return the target property', () => {
            expect(fromProviderCopy.getTarget(snapshot)).toBe(snapshot.target);
        });
    });
});
