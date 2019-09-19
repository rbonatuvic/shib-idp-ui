import { reducer } from './filter.reducer';
import * as fromFilterCompare from './filter.reducer';
import {
    SetFilterComparisonSchema,
    ClearFilterComparison,
    SetFilterComparisonDefinition,
    CompareFilterVersions
} from '../action/filter.action';
import { NameIDFilterConfiguration } from '../../filter/model/nameid-configuration.filter';
import { Metadata } from '../../domain/domain.type';

describe('Filter Comparison Reducer', () => {
    const initialState: fromFilterCompare.State = { ...fromFilterCompare.initialState };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(initialState);
        });
    });

    describe('SET_SCHEMA action', () => {
        it('should add the provided schema to the state', () => {
            const schema = {type: 'object', properties: { foo: { type: 'string' } }};
            const action = new SetFilterComparisonSchema(schema);
            const result = reducer(initialState, action);
            expect(result.schema).toEqual(schema);
        });
    });

    describe('SET_DEFINITION action', () => {
        it('should add the provided definition to the state', () => {
            const definition = NameIDFilterConfiguration;
            const action = new SetFilterComparisonDefinition(definition);
            const result = reducer(initialState, action);
            expect(result.definition).toEqual(definition);
        });
    });

    describe('COMPARE_FILTERS action', () => {
        it('should add model information to the state', () => {
            const request = {
                modelId: 'foo',
                modelType: 'EntityAttributesFilter',
                models: [{}, {}] as Metadata[]
            };
            const action = new CompareFilterVersions(request);
            const result = reducer(initialState, action);
            expect(result.modelId).toEqual(request.modelId);
            expect(result.modelType).toEqual(request.modelType);
            expect(result.models).toEqual(request.models);
        });
    });

    describe('CLEAR action', () => {
        it('should reset to the initial state', () => {
            const action = new ClearFilterComparison();
            const result = reducer(initialState, action);
            expect(result).toEqual(initialState);
        });
    });

    describe('selector functions', () => {
        describe('getModel', () => {
            it('should retrieve the model from state', () => {
                const models = [{}, {}] as Metadata[];
                expect(fromFilterCompare.getModelId({ ...initialState, modelId: 'foo' })).toBe('foo');
                expect(fromFilterCompare.getModelType({ ...initialState, modelType: 'foo' })).toBe('foo');
                expect(fromFilterCompare.getModels({ ...initialState, models })).toBe(models);
            });
        });
        describe('getLoading', () => {
            it('should retrieve the loading state', () => {
                expect(fromFilterCompare.getLoading({ ...initialState, loading: true })).toBe(true);
            });
        });

        describe('getSchema', () => {
            it('should retrieve the schema from state', () => {
                const schema = {};
                expect(fromFilterCompare.getSchema({ ...initialState, schema })).toBe(schema);
            });
        });

        describe('getDefinition', () => {
            it('should retrieve the definition from state', () => {
                const definition = NameIDFilterConfiguration;
                expect(fromFilterCompare.getDefinition({ ...initialState, definition })).toBe(NameIDFilterConfiguration);
            });
        });
    });
});
