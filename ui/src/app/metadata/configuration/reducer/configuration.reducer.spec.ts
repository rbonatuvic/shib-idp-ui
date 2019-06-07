import { reducer } from './configuration.reducer';
import * as fromConfig from './configuration.reducer';
import * as actions from '../action/configuration.action';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { SCHEMA as schema } from '../../../../testing/form-schema.stub';
import { MetadataResolver } from '../../domain/model';

describe('Configuration Reducer', () => {
    const initialState: fromConfig.State = { ...fromConfig.initialState };

    const definition = new MetadataSourceEditor();
    const model: MetadataResolver = {
        id: 'foo',
        serviceProviderName: 'foo',
        '@type': 'MetadataResolver'
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(initialState);
        });
    });

    describe('SET_DEFINITION action', () => {
        it('should set the state definition', () => {
            const action = new actions.SetDefinition(definition);
            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, definition });
        });
    });

    describe('SET_SCHEMA action', () => {
        it('should set the state schema', () => {
            const action = new actions.SetSchema(schema);
            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, schema });
        });
    });

    describe('SET_METADATA action', () => {
        it('should set the state metadata model', () => {
            const action = new actions.SetMetadata(model as MetadataResolver);
            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, model });
        });
    });

    describe('CLEAR action', () => {
        it('should clear the state and reset to initial state', () => {
            const action = new actions.ClearConfiguration();
            const result = reducer({
                ...initialState,
                model,
                definition,
                schema
            }, action);

            expect(result).toEqual(initialState);
        });
    });
});
