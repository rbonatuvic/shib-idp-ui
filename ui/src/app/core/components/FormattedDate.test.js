import React from 'react';
import { render, screen } from '@testing-library/react';

import { FormattedDate } from './FormattedDate';

it('should display a formatted date', () => {
    render(<FormattedDate date={ '2021-06-10T12:28:52.514342' } />);
    expect(screen.getByText('Jun 10, 2021')).toBeInTheDocument();
});