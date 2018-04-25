import { reducer } from './provider-collection.reducer';
import * as fromProvider from './provider-collection.reducer';
import * as providerActions from '../action/provider-collection.action';
import { MetadataProvider } from '../model/metadata-provider';

let providers: MetadataProvider[] = [
    { id: '1', entityId: 'foo', serviceProviderName: 'bar', createdDate: 'Tue Apr 17 2018 13:33:54 GMT-0700 (MST)' } as MetadataProvider,
    { id: '2', entityId: 'baz', serviceProviderName: 'fin', createdDate: 'Tue Apr 17 2018 13:34:07 GMT-0700 (MST)' } as MetadataProvider
],
    snapshot: fromProvider.ProviderCollectionState = {
        ids: [providers[0].id, providers[1].id],
        entities: {
            [providers[0].id]: providers[0],
            [providers[1].id]: providers[1]
        },
        selectedProviderId: null
    };

describe('Provider Reducer', () => {
    const initialState: fromProvider.ProviderCollectionState = {
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
        it('should add the loaded providers to the collection', () => {
            const action = new providerActions.LoadProviderSuccess(providers);
            const result = reducer(initialState, action);

            expect(result).toEqual(
                Object.assign({}, initialState, snapshot)
            );
        });
    });

    describe('Update Providers: Success', () => {
        it('should update the draft of the specified id', () => {
            let changes = { ...providers[1], serviceEnabled: true },
                expected = {
                    ids: [providers[0].id, providers[1].id],
                    entities: {
                        [providers[0].id]: providers[0],
                        [providers[1].id]: changes
                    },
                    selectedProviderId: null
                };
            const action = new providerActions.UpdateProviderSuccess({id: changes.id, changes});
            const result = reducer({ ...snapshot }, action);

            expect(result).toEqual(
                Object.assign({}, initialState, expected)
            );
        });

        it('should return state if the entityId is not found', () => {
            let changes = { ...providers[1], serviceEnabled: true, id: '4' };
            const action = new providerActions.UpdateProviderSuccess({id: changes.id, changes});
            const result = reducer({ ...snapshot }, action);

            expect(result).toEqual(snapshot);
        });
    });

    describe('Select Provider', () => {
        it('should update the selected draft id', () => {
            let id = 'foo',
                expected = { ...snapshot, selectedProviderId: id };
            const action = new providerActions.SelectProvider(id);
            const result = reducer({ ...snapshot }, action);

            expect(result).toEqual(
                Object.assign({}, initialState, expected)
            );
        });
    });
});
