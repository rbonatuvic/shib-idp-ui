import { render, screen } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import React from 'react';
import { RolesProvider } from './RolesProvider';

import { useRoles } from '../hooks';

jest.mock('../../App.constant', () => ({
    get API_BASE_PATH() {
        return '/';
    }
}));

jest.mock('../hooks');

jest.mock('../../store/notifications/NotificationSlice');

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch
}));


describe('RolesProvider component', () => {

    beforeEach(() => {

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