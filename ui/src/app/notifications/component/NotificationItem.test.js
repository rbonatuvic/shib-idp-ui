import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { NotificationItem } from './NotificationItem';

jest.mock('../../i18n/hooks', () => ({
    useTranslation: (value) => value
}));

describe('Notifcation Item', () => {
    let context;
    beforeEach(() => {
        jest.useFakeTimers();
    })

    it('should change color based on type', () => {
        render(<NotificationItem type="danger" body="foo" />);
        const el = screen.getByText('foo');
        expect(el).toBeInTheDocument();
        expect(el).toHaveClass('alert-danger')
    });

    it('should dispatch an event if provided a timeout', () => {

        const mockOnRemove = jest.fn();

        render(<NotificationItem type="danger" body="foo" timeout={5000} onRemove={mockOnRemove} />);

        jest.runAllTimers();

        expect(mockOnRemove).toHaveBeenCalled();
    });
})
