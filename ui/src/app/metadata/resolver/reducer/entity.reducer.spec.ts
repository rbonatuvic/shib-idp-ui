import { reducer } from './entity.reducer';
import * as fromEntity from './entity.reducer';
import {
    UpdateChanges,
    UpdateStatus,
    Clear
} from '../action/entity.action';
import { MetadataResolver } from '../../domain/model';

describe('Editor Reducer', () => {
    const initialState: fromEntity.EditorState = {
        saving: false,
        status: {},
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

    describe('Entity Update Status', () => {
        it('should update the status of the provided form', () => {
            const status = { organization: 'VALID' };
            const action = new UpdateStatus(status);
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
            const action = new UpdateChanges(changes);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    changes: changes
                })
            );
        });
    });

    describe('Editor Clear', () => {
        it('should remove changes', () => {
            const action = new Clear();
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
            const action = new UpdateChanges(changes);
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
            expect(fromEntity.isEditorValid({
                saving: false,
                changes: {} as MetadataResolver,
                status: {
                    organization: 'INVALID',
                    foo: 'VALID'
                }
            })).toBe(false);
        });

        it('should calculate a saved status based on changes', () => {
            expect(fromEntity.isEditorSaving({
                saving: false,
                changes: {} as MetadataResolver,
                status: {}
            })).toBe(true);

            expect(fromEntity.isEditorSaving({
                saving: false,
                changes: {organization: {}, entityId: 'bar'} as MetadataResolver,
                status: {}
            })).toBe(false);
        });

        it('should return current changes', () => {
            expect(fromEntity.getChanges({
                saving: false,
                changes: {} as MetadataResolver,
                status: {}
            })).toEqual({} as MetadataResolver);
        });

        it('should return `saving` status', () => {
            expect(fromEntity.isEditorSaving({
                saving: false,
                changes: {} as MetadataResolver,
                status: {}
            })).toBe(false);

            expect(fromEntity.isEditorSaving({
                saving: true,
                changes: {} as MetadataResolver,
                status: {}
            })).toBe(true);
        });
    });
});
