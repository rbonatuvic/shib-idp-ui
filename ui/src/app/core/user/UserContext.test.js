import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProvider, useIsAdmin } from './UserContext';

const getFn = jest.fn();
const okFn = jest.fn();

const mockUseFetch = {
    get: getFn,
    response: {}
};

Object.defineProperty(mockUseFetch.response, 'ok', {
    get: okFn
});

jest.mock('use-http', () => () => mockUseFetch);

const TestAdmin = () => {
    const isAdmin = useIsAdmin();
    return (<>{ isAdmin ? 'yes' : 'no' }</>)
}

describe('User Context defined', () => {

    beforeEach(() => {
        getFn.mockReturnValue(Promise.resolve({
            role: 'ROLE_ADMIN'
        }));
        okFn.mockReturnValueOnce(true);
    });

    it('should render the component children', async () => {
        render(<UserProvider>
            {<div>test</div>}
        </UserProvider>);
        await waitFor(() => expect(screen.getByText('test')).toBeInTheDocument());
    });

    it('should provide the user context', async () => {
        render(<UserProvider>
            <TestAdmin />
        </UserProvider>);

        await waitFor(() => expect(screen.getByText('yes')).toBeInTheDocument());
    });
});
