import { render, screen } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import React from 'react';
import {RoleProvider} from './RoleProvider';

import {useRole} from '../hooks';

jest.mock('../../App.constant', () => ({
    get API_BASE_PATH() {
        return '/';
    }
}));

jest.mock('../hooks');

describe('RoleProvider component', () => {
    // let get;

    test('should provide the role context', async () => {
        let get = jest.fn().mockResolvedValue({ id: 'foo' });
        useRole.mockImplementation(() => {
            return {
                get,
                response: {
                    ok: false,
                    status: 200
                }
            };
        });

        act(() => {
            render(<RoleProvider id={'foo'}>
            {(role) => <div>{role?.id}</div>}
            </RoleProvider>);
        });

        expect(useRole).toHaveBeenCalled();
        expect(get).toHaveBeenCalled();
    });

})