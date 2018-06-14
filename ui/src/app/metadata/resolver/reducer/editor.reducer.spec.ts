import { reducer } from './editor.reducer';
import * as fromEditor from './editor.reducer';
import * as actions from '../action/editor.action';
import * as collectionActions from '../action/collection.action';
import { MetadataResolver } from '../../domain/model';

describe('Editor Reducer', () => {
    const initialState: fromEditor.EditorState = {
        saving: false,
        formStatus: {},
        changes: {} as MetadataResolver
    };

    const changes = {
        entityId: 'foo',
        serviceProviderName: 'bar'
    } as MetadataResolver;

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);
            expect(result).toEqual(initialState);
        });
    });

    describe('Editor Add Resolver', () => {
        it('should update the status when a provider is saved', () => {
            const action = new collectionActions.AddProviderRequest(changes);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    saving: true
                })
            );
        });

        it('should update the status on success', () => {
            const action = new collectionActions.AddProviderSuccess(changes);
            const result = reducer({...initialState, changes: {...changes, organization: {name: 'foo'}}}, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    saving: false,
                    changes: initialState.changes
                })
            );
        });

        it('should update the status on success', () => {
            const action = new collectionActions.AddProviderFail(changes);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    saving: false
                })
            );
        });
    });

    describe('Editor Update Status', () => {
        it('should update the status of the provided form', () => {
            const status = { organization: 'VALID' };
            const action = new actions.UpdateStatus(status);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    formStatus: status
                })
            );
        });
    });

    describe('Editor Update Changes', () => {
        it('should add changes of the provided form', () => {
            const action = new actions.UpdateChanges(changes);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    changes: changes
                })
            );
        });
    });

    describe('Editor Reset', () => {
        it('should remove changes', () => {
            const action = new actions.ResetChanges();
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    changes: initialState.changes
                })
            );
        });
    });

    describe('Editor Save', () => {
        it('should remove changes', () => {
            const action = new actions.SaveChanges(changes);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    changes: initialState.changes
                })
            );
        });
    });

    describe('Editor Cancel', () => {
        it('should remove changes', () => {
            const action = new actions.CancelChanges();
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    changes: initialState.changes
                })
            );
        });
    });

    describe('Selectors', () => {
        it('should aggregate the status', () => {
            expect(fromEditor.isEditorValid({
                saving: false,
                changes: {} as MetadataResolver,
                formStatus: {
                    organization: 'INVALID',
                    foo: 'VALID'
                }
            })).toBe(false);
        });

        it('should calculate a saved status based on changes', () => {
            expect(fromEditor.isEditorSaved({
                saving: false,
                changes: {} as MetadataResolver,
                formStatus: {}
            })).toBe(true);

            expect(fromEditor.isEditorSaved({
                saving: false,
                changes: {organization: {}, entityId: 'bar'} as MetadataResolver,
                formStatus: {}
            })).toBe(false);
        });

        it('should return current changes', () => {
            expect(fromEditor.getChanges({
                saving: false,
                changes: {} as MetadataResolver,
                formStatus: {}
            })).toEqual({} as MetadataResolver);
        });

        it('should return `saving` status', () => {
            expect(fromEditor.isEditorSaving({
                saving: false,
                changes: {} as MetadataResolver,
                formStatus: {}
            })).toBe(false);

            expect(fromEditor.isEditorSaving({
                saving: true,
                changes: {} as MetadataResolver,
                formStatus: {}
            })).toBe(true);
        });
    });
});
