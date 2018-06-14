import { reducer } from './collection.reducer';
import * as fromCollection from './collection.reducer';
import * as resolverActions from '../action/collection.action';
import { MetadataResolver } from '../../domain/model';

let resolvers: MetadataResolver[] = [
    { id: '1', entityId: 'foo', serviceProviderName: 'bar', createdDate: 'Tue Apr 17 2018 13:33:54 GMT-0700 (MST)' } as MetadataResolver,
    { id: '2', entityId: 'baz', serviceProviderName: 'fin', createdDate: 'Tue Apr 17 2018 13:34:07 GMT-0700 (MST)' } as MetadataResolver
],
    snapshot: fromCollection.CollectionState = {
        ids: [resolvers[0].id, resolvers[1].id],
        entities: {
            [resolvers[0].id]: resolvers[0],
            [resolvers[1].id]: resolvers[1]
        },
        selectedProviderId: null
    };

describe('Resolver Reducer', () => {
    const initialState: fromCollection.CollectionState = {
        ids: [],
        entities: {},
        selectedProviderId: null,
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(initialState);
        });
    });

    describe('Load Providers: Success', () => {
        it('should add the loaded resolvers to the collection', () => {
            const action = new resolverActions.LoadProviderSuccess(resolvers);
            const result = reducer(initialState, action);

            expect(result).toEqual(
                Object.assign({}, initialState, snapshot)
            );
        });
    });

    describe('Update Providers: Success', () => {
        it('should update the draft of the specified id', () => {
            let changes = { ...resolvers[1], serviceEnabled: true },
                expected = {
                    ids: [resolvers[0].id, resolvers[1].id],
                    entities: {
                        [resolvers[0].id]: resolvers[0],
                        [resolvers[1].id]: changes
                    },
                    selectedProviderId: null
                };
            const action = new resolverActions.UpdateProviderSuccess({id: changes.id, changes});
            const result = reducer({ ...snapshot }, action);

            expect(result).toEqual(
                Object.assign({}, initialState, expected)
            );
        });

        it('should return state if the entityId is not found', () => {
            let changes = { ...resolvers[1], serviceEnabled: true, id: '4' };
            const action = new resolverActions.UpdateProviderSuccess({id: changes.id, changes});
            const result = reducer({ ...snapshot }, action);

            expect(result).toEqual(snapshot);
        });
    });

    describe('Select Resolver', () => {
        it('should update the selected draft id', () => {
            let id = 'foo',
                expected = { ...snapshot, selectedProviderId: id };
            const action = new resolverActions.SelectProvider(id);
            const result = reducer({ ...snapshot }, action);

            expect(result).toEqual(
                Object.assign({}, initialState, expected)
            );
        });
    });
});
