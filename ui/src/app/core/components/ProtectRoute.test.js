import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom';
import { ProtectRoute } from './ProtectRoute';

const mockIsAdmin = jest.fn();

jest.mock('../user/UserContext', () => ({
    useIsAdmin: () => mockIsAdmin()
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route)

    return render(ui, { wrapper: BrowserRouter })
}

describe('AdminRoute user is admin', () => {
    beforeEach(() => {
        mockIsAdmin.mockReturnValue(true);
    });

    it('should render the component if user is an admin', () => {
        render(<ProtectRoute redirectTo={"/dashboard"}><React.Fragment>hi there</React.Fragment></ProtectRoute>, { wrapper: MemoryRouter });
        expect(screen.getByText('hi there')).toBeInTheDocument();
    });
});

describe('AdminRoute user is NOT admin', () => {
    beforeEach(() => {
        mockIsAdmin.mockReturnValue(false);
    });

    it('should redirect the user to the dashboard if not admin', () => {
        renderWithRouter(<React.Fragment>
            <ProtectRoute redirectTo={'/dashboard'}><React.Fragment>hi there</React.Fragment></ProtectRoute>
            <Route path="/dashboard" render={ () => 'dashboard' } />
        </React.Fragment>, {route: '/foo'});
        expect(screen.getByText('dashboard')).toBeInTheDocument();
    });
});