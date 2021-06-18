import React from 'react';
import { render, screen } from '@testing-library/react';

import { NotificationItem } from './NotificationItem';
import { NotificationContext, Notifications } from '../hoc/Notifications';

jest.mock('../../i18n/hooks', () => ({
    useTranslation: (value) => value
}));

describe('Notifcation Item', () => {
    let context;
    beforeEach(() => {
        jest.useFakeTimers();

        context = React.useContext(NotificationContext);
    })

    it('should change color based on type', () => {
        render(<NotificationItem type="danger" body="foo" />, {wrapper: Notifications });
        const el = screen.getByText('foo');
        expect(el).toBeInTheDocument();
        expect(el).toHaveClass('alert-danger')
    });

    it('should dispatch an event if provided a timeout', () => {

        jest.spyOn(context, 'dispatch');

        render(<NotificationItem type="danger" body="foo" timeout={5000} />, { wrapper: Notifications });
        const el = screen.getByText('foo');

        jest.runAllTimers();

        expect(context.dispatch).toHaveBeenCalled();
    });
})
