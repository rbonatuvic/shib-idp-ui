import { reducer, initialState as snapshot } from './wizard.reducer';
import * as selectors from './wizard.reducer';
import { WizardActionTypes, ClearWizard, AddSchema, SetDisabled, SetDefinition, SetIndex, UpdateDefinition } from '../action/wizard.action';
import { SCHEMA } from '../../../testing/form-schema.stub';
import { MetadataProviderWizard, FileBackedHttpMetadataProviderWizard } from '../../metadata/provider/model';



describe('Wizard Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${WizardActionTypes.CLEAR}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new ClearWizard())).toEqual(snapshot);
        });
    });

    describe(`${WizardActionTypes.ADD_SCHEMA}`, () => {
        it('should add the payload to the schema collection', () => {
            expect(reducer(snapshot, new AddSchema({id: 'foo', schema: SCHEMA })).schemaCollection).toEqual({ 'foo': SCHEMA });
        });
    });

    describe(`${WizardActionTypes.SET_DISABLED}`, () => {
        it('should set the disabled property on the wizard', () => {
            expect(reducer(snapshot, new SetDisabled(true)).disabled).toBe(true);
            expect(reducer(snapshot, new SetDisabled(false)).disabled).toBe(false);
        });
    });

    describe(`${WizardActionTypes.SET_DEFINITION}`, () => {
        it('should set the definition property on the wizard', () => {
            expect(reducer(snapshot, new SetDefinition(MetadataProviderWizard)).definition).toBe(MetadataProviderWizard);
        });
    });

    describe(`${WizardActionTypes.SET_INDEX}`, () => {
        it('should set the definition property on the wizard', () => {
            expect(reducer(snapshot, new SetIndex(MetadataProviderWizard.steps[0].id)).index).toBe('new');
        });
    });

    describe(`${WizardActionTypes.SET_INDEX}`, () => {
        let state = reducer(snapshot, new SetDefinition(MetadataProviderWizard));
        it('should set the definition property on the wizard', () => {
            expect(reducer(state, new UpdateDefinition(FileBackedHttpMetadataProviderWizard))).toEqual({
                ...state,
                definition: {
                    ...MetadataProviderWizard,
                    ...FileBackedHttpMetadataProviderWizard,
                    steps: [
                        ...MetadataProviderWizard.steps,
                        ...FileBackedHttpMetadataProviderWizard.steps
                    ]
                }
            });
        });
    });

    describe('selector functions', () => {
        it('should return pieces of state', () => {
            expect(selectors.getCollection(snapshot)).toEqual(snapshot.schemaCollection);
            expect(selectors.getDefinition(snapshot)).toEqual(snapshot.definition);
            expect(selectors.getDisabled(snapshot)).toEqual(snapshot.disabled);
            expect(selectors.getIndex(snapshot)).toEqual(snapshot.index);
        });
    });
});
