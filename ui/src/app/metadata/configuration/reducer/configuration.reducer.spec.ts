import { reducer } from './configuration.reducer';
import * as fromConfig from './configuration.reducer';
import * as actions from '../action/configuration.action';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { SCHEMA } from '../../../../testing/form-schema.stub';
import { MetadataResolver } from '../../domain/model';

describe('Configuration Reducer', () => {
    const initialState: fromConfig.State = { ...fromConfig.initialState };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(initialState);
        });
    });

    describe('SET_DEFINITION action', () => {
        it('should set the state definition', () => {
            const definition = new MetadataSourceEditor();
            const action = new actions.SetDefinition(definition);
            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, definition });
        });
    });

    describe('SET_SCHEMA action', () => {
        it('should set the state schema', () => {
            const action = new actions.SetSchema(SCHEMA);
            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, schema: SCHEMA });
        });
    });

    describe('SET_METADATA action', () => {
        it('should set the state metadata model', () => {
            const model: MetadataResolver = {
                id: 'foo',
                serviceProviderName: 'foo',
                '@type': 'MetadataResolver'
            };
            const action = new actions.SetMetadata(model as MetadataResolver);
            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, model });
        });
    });
});
