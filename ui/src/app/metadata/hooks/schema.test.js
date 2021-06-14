import React from 'react';
import { useUiSchema } from './schema';

import { SourceEditor } from '../domain/source/SourceDefinition';

import jsonSchema from '../../../testing/sourceSchema';
import uiSchemaResult from '../../../testing/uiSchema';

import { useIsAdmin } from '../../core/user/UserContext';
jest.mock('../../core/user/UserContext');

describe('useUiSchema', () => {
    let realUseMemo;
    let useMemoMock;
    beforeEach(() => {
        realUseMemo = React.useMemo;
        useMemoMock = React.useMemo = (cb) => cb();
    });
    // Cleanup mock
    afterEach(() => {
        React.useMemo = realUseMemo;
    });

    test('should return a parsed ui schema', () => {
        useIsAdmin.mockResolvedValue(false);

        const { uiSchema } = useUiSchema(SourceEditor, jsonSchema, 'common')
        expect(uiSchema).toEqual(uiSchemaResult);
    })
    
});