import React from 'react';
import { render, screen } from '@testing-library/react';
import { Translate } from './translate';


jest.mock('../hooks', () => ({
    useTranslation: () => 'success'
}));

it('should display translated text', () => {
    render(<Translate value="foo.bar" />);
    expect(screen.getByText('success')).toBeInTheDocument();
});
