import { render, screen } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import React from 'react';
import { RolesProvider } from './RolesProvider';

import { useRoles } from '../hooks';
import { useNotificationDispatcher } from "../../notifications/hoc/Notifications";

jest.mock('../hooks');

jest.mock('../../notifications/hoc/Notifications');

describe('RolesProvider component', () => {

    beforeEach(() => {

        useNotificationDispatcher.mockImplementation(() => {
            return {};
        });

        useRoles.mockImplementation(() => {
            return {
                get: jest.fn().mockResolvedValue([]),
                response: {
                    ok: false,
                    status: 200
                }
            };
        });
    })

    test('should provide the roles context', async () => {
        act(() => {
            render(<RolesProvider>
                {(roles) => <div>{roles.length}</div>}
            </RolesProvider>);
        });

        expect(useRoles).toHaveBeenCalled();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

})