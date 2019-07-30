import { reducer } from './compare.reducer';
import * as fromCompare from './compare.reducer';
import { MetadataResolver } from '../../domain/model';
import { SetMetadataVersions, ClearVersions } from '../action/compare.action';

describe('Comparison Reducer', () => {
    const initialState: fromCompare.State = { ...fromCompare.initialState };
    const models: MetadataResolver[] = [{
        id: 'foo',
        serviceProviderName: 'foo',
        '@type': 'MetadataResolver',
        createdBy: 'admin'
    }];

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(initialState);
        });
    });

    describe('set versions action', () => {
        it('should add the models to the state', () => {
            const action = new SetMetadataVersions(models);
            const result = reducer(initialState, action);
            expect(result.models).toEqual(models);
            expect(result.loaded).toBe(true);
        });
    });

    describe('clear versions action', () => {
        it('should remove the models from the state', () => {
            const action = new ClearVersions();
            const result = reducer(initialState, action);
            expect(result.models).toEqual([]);
            expect(result.loaded).toBe(false);
        });
    });

    describe('selector functions', () => {
        describe('getModel', () => {
            it('should retrieve the model from state', () => {
                expect(fromCompare.getVersionModels({ ...initialState, models })).toBe(models);
            });
        });
        describe('getVersionModelsLoaded', () => {
            it('should retrieve the loaded state', () => {
                expect(fromCompare.getVersionModelsLoaded({ ...initialState, loaded: true })).toBe(true);
            });
        });
    });
});
