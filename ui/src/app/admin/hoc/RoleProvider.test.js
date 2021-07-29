import { render, screen } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import React from 'react';
import {RoleProvider} from './RoleProvider';

import {useRole} from '../hooks';

jest.mock('../hooks');

describe('RoleProvider component', () => {

    beforeEach(() => {
        useRole.mockImplementation(() => {
            return {
                get: jest.fn().mockResolvedValue({ id: 'foo' }),
                response: {
                    ok: false,
                    status: 200
                }
            };
        });
    })

    test('should provide the role context', async () => {
        act(() => {
            render(<RoleProvider id={'foo'}>
            {(role) => <div>{role?.id}</div>}
            </RoleProvider>);
        });

        expect(useRole).toHaveBeenCalled();
        expect(screen.getByText('foo')).toBeInTheDocument();
    });

})