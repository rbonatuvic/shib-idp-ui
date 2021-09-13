import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './Header';

jest.mock('../../App.constant', () => ({
    get API_BASE_PATH() {
        return '/';
    }
}));

jest.mock('../../i18n/hooks', () => ({
    useTranslator: () => (value) => value,
    useTranslation: (value) => value
}));

const mockIsAdmin = jest.fn();

jest.mock('../user/UserContext', () => ({
    useIsAdmin: () => mockIsAdmin()
}));

describe('header for admins', () => {
    beforeEach(() => {
        mockIsAdmin.mockReturnValue(true);
    });

    it('should display logo and navigation', () => {
        render(<Router><Header /></Router>);
        expect(screen.getByText('brand.logo-link-label')).toBeInTheDocument();
    });
});

