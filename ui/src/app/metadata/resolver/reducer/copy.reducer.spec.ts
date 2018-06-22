import { reducer } from './copy.reducer';
import * as fromResolverCopy from './copy.reducer';
import * as actions from '../action/copy.action';
import * as fromCollection from '../action/collection.action';
import { CopySourceActionTypes, CreateResolverCopyRequest } from '../action/copy.action';
import { FileBackedHttpMetadataResolver } from '../../domain/entity/resolver/file-backed-http-metadata-resolver';

const snapshot: fromResolverCopy.CopyState = { ...fromResolverCopy.initialState };

describe('Resolver -> Copy Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);
            expect(result).toEqual(snapshot);
        });
    });

    describe(`${CopySourceActionTypes.CREATE_RESOLVER_COPY_REQUEST} action`, () => {
        it('should set properties on the state', () => {
            const obj = { ...snapshot };
            const result = reducer(snapshot, new CreateResolverCopyRequest(obj));

            expect(result).toEqual(obj);
        });
    });

    describe(`${CopySourceActionTypes.CREATE_RESOLVER_COPY_SUCCESS} action`, () => {
        it('should set properties on the state', () => {
            const p = new FileBackedHttpMetadataResolver({});
            const obj = { ...snapshot };
            const result = reducer(snapshot, new actions.CreateResolverCopySuccess(p));

            expect(result.provider).toBe(p);
        });
    });

    describe(`${CopySourceActionTypes.CREATE_RESOLVER_COPY_ERROR} action`, () => {
        it('should set properties on the state', () => {
            const p = new FileBackedHttpMetadataResolver({});
            const obj = { ...snapshot };
            const result = reducer(snapshot, new actions.CreateResolverCopyError(new Error()));

            expect(result.provider).toBeNull();
        });
    });

    describe(`${CopySourceActionTypes.UPDATE_RESOLVER_COPY} action`, () => {
        it('should set properties on the state', () => {
            const obj = { ...snapshot, provider: new FileBackedHttpMetadataResolver({}) };
            const result = reducer(snapshot, new actions.UpdateResolverCopy({id: 'foo'}));

            expect(result.provider.id).toBe('foo');
        });
    });

    describe(`${ fromCollection.ResolverCollectionActionTypes.ADD_RESOLVER } action`, () => {
        it('should set properties on the state', () => {
            const p = new FileBackedHttpMetadataResolver({});
            const obj = { ...snapshot, provider: p };
            const result = reducer(snapshot, new fromCollection.AddResolverRequest(p));

            expect(result.saving).toBe(true);
        });
    });

    describe(`${fromCollection.ResolverCollectionActionTypes.ADD_RESOLVER_SUCCESS} action`, () => {
        it('should set properties on the state', () => {
            const p = new FileBackedHttpMetadataResolver({});
            const obj = { ...snapshot, provider: p };
            const result = reducer(snapshot, new fromCollection.AddResolverSuccess(p));

            expect(result.saving).toBe(false);
        });
    });

    describe(`${fromCollection.ResolverCollectionActionTypes.ADD_RESOLVER_FAIL} action`, () => {
        it('should set properties on the state', () => {
            const p = new FileBackedHttpMetadataResolver({});
            const obj = { ...snapshot, provider: p };
            const result = reducer(snapshot, new fromCollection.AddResolverFail(p));

            expect(result.saving).toBe(false);
        });
    });

    describe(`getCopy selector function`, () => {
        it('should return the entire copy object', () => {
            expect(fromResolverCopy.getCopy(snapshot)).toBe(snapshot.provider);
        });
    });
    describe(`getEntityId selector function`, () => {
        it('should return the entityId property', () => {
            expect(fromResolverCopy.getEntityId(snapshot)).toBe(snapshot.entityId);
        });
    });
    describe(`getName selector function`, () => {
        it('should return the serviceProviderName property', () => {
            expect(fromResolverCopy.getName(snapshot)).toBe(snapshot.serviceProviderName);
        });
    });
    describe(`getTarget selector function`, () => {
        it('should return the target property', () => {
            expect(fromResolverCopy.getTarget(snapshot)).toBe(snapshot.target);
        });
    });
});
