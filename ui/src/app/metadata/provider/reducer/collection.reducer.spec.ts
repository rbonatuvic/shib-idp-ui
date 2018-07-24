import { reducer } from './collection.reducer';
import * as fromProvider from './collection.reducer';
import {
    ProviderCollectionActionTypes,
    LoadProviderSuccess,
    UpdateProviderSuccess
} from '../action/collection.action';

const snapshot: fromProvider.CollectionState = {
    ids: [],
    entities: {},
    selectedProviderId: null,
    loaded: false
};

describe('Provider Collection Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${ProviderCollectionActionTypes.LOAD_PROVIDER_SUCCESS}`, () => {
        it('should add the loaded providers to the collection', () => {
            spyOn(fromProvider.adapter, 'addAll').and.callThrough();
            const providers = [
                {
                    resourceId: 'foo',
                    name: 'name',
                    '@type': 'foo',
                    enabled: true,
                    createdDate: new Date().toLocaleDateString(),
                    sortKey: 1,
                    metadataFilters: []
                },
                {
                    resourceId: 'bar',
                    name: 'bar',
                    '@type': 'bar',
                    enabled: false,
                    createdDate: new Date().toLocaleDateString(),
                    sortKey: 2,
                    metadataFilters: []
                }
            ];
            const action = new LoadProviderSuccess(providers);
            const result = reducer(snapshot, action);
            expect(fromProvider.adapter.addAll).toHaveBeenCalled();
        });
    });

    describe(`${ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS}`, () => {
        it('should add the loaded providers to the collection', () => {
            spyOn(fromProvider.adapter, 'updateOne').and.callThrough();
            const update = {
                id: 'foo',
                changes: { resourceId: 'foo', name: 'bar', createdDate: new Date().toLocaleDateString() },
            };
            const action = new UpdateProviderSuccess(update);
            const result = reducer(snapshot, action);
            expect(fromProvider.adapter.updateOne).toHaveBeenCalled();
        });
    });
});
