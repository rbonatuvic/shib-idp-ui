import { reducer, initialState as snapshot } from './editor.reducer';
import {
    EditorActionTypes,
    ClearEditor,
    LockEditor,
    LoadSchemaRequest,
    LoadSchemaFail,
    LoadSchemaSuccess,
    UnlockEditor,
    SelectProviderType
} from '../action/editor.action';

describe('Provider Editor Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${EditorActionTypes.CLEAR}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new ClearEditor())).toEqual(snapshot);
        });
    });

    describe(`${EditorActionTypes.LOCK}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new LockEditor())).toEqual({ ...snapshot, locked: true });
        });
    });

    describe(`${EditorActionTypes.UNLOCK}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new UnlockEditor())).toEqual({ ...snapshot, locked: false });
        });
    });

    describe(`${EditorActionTypes.LOAD_SCHEMA_REQUEST}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new LoadSchemaRequest('foo'))).toEqual({ ...snapshot, schemaPath: 'foo', loading: true });
        });
    });

    describe(`${EditorActionTypes.LOAD_SCHEMA_FAIL}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new LoadSchemaFail(new Error('fail')))).toEqual({ ...snapshot });
        });
    });

    describe(`${EditorActionTypes.LOAD_SCHEMA_REQUEST}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new LoadSchemaSuccess({}))).toEqual({ ...snapshot, schema: {} });
        });
    });

    describe(`${EditorActionTypes.SELECT_PROVIDER_TYPE}`, () => {
        it('should reset to initial state', () => {
            expect(reducer(snapshot, new SelectProviderType('foo'))).toEqual({ ...snapshot, type: 'foo' });
        });
    });
});
