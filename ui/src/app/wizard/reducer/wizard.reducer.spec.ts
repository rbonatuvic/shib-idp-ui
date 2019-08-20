import { reducer, initialState as snapshot } from './wizard.reducer';
import * as selectors from './wizard.reducer';
import {
    WizardActionTypes,
    ClearWizard,
    SetDisabled,
    SetDefinition,
    SetIndex,
    LockEditor,
    LoadSchemaRequest,
    LoadSchemaFail,
    LoadSchemaSuccess,
    UnlockEditor,
    UpdateDefinition
} from '../action/wizard.action';
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

    describe(`${WizardActionTypes.LOCK}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new LockEditor())).toEqual({ ...snapshot, locked: true });
        });
    });

    describe(`${WizardActionTypes.UNLOCK}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new UnlockEditor())).toEqual({ ...snapshot, locked: false });
        });
    });

    describe(`${WizardActionTypes.LOAD_SCHEMA_REQUEST}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new LoadSchemaRequest('foo'))).toEqual({ ...snapshot, schemaPath: 'foo', loading: true });
        });
    });

    describe(`${WizardActionTypes.LOAD_SCHEMA_FAIL}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new LoadSchemaFail(new Error('fail')))).toEqual({ ...snapshot });
        });
    });

    describe(`${WizardActionTypes.LOAD_SCHEMA_REQUEST}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new LoadSchemaSuccess({}))).toEqual({ ...snapshot, schema: {} });
        });
    });

    describe('selector functions', () => {
        it('should return pieces of state', () => {
            expect(selectors.getDefinition(snapshot)).toEqual(snapshot.definition);
            expect(selectors.getDisabled(snapshot)).toEqual(snapshot.disabled);
            expect(selectors.getIndex(snapshot)).toEqual(snapshot.index);
        });
    });
});
