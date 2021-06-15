import React from 'react';
import { act, render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom';
import { AdminRoute } from './AdminRoute';

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
        render(<AdminRoute><React.Fragment>hi there</React.Fragment></AdminRoute>, { wrapper: MemoryRouter });
        expect(screen.getByText('hi there')).toBeInTheDocument();
    });
});

describe('AdminRoute user is NOT admin', () => {
    beforeEach(() => {
        mockIsAdmin.mockReturnValue(false);
    });

    it('should redirect the user to the dashboard if not admin', () => {
        renderWithRouter(<React.Fragment>
            <AdminRoute path="/foo"><React.Fragment>hi there</React.Fragment></AdminRoute>
            <Route path="/dashboard" render={ () => 'dashboard' } />
        </React.Fragment>, {route: '/foo'});
        expect(screen.getByText('dashboard')).toBeInTheDocument();
    });
});