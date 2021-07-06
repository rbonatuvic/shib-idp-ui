import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

jest.mock('../../i18n/hooks', () => ({
    useTranslation: (value) => value
}));

it('should display the footer', () => {
    render(<Footer />);
    expect(screen.getByText('brand.footer.text')).toBeInTheDocument();
});
