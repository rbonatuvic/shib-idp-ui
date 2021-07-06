import React from 'react';
import { render, screen } from '@testing-library/react';

import { NotificationList } from './NotificationList';
import { NotificationContext } from '../hoc/Notifications';

jest.mock('../../i18n/hooks', () => ({
    useTranslation: (value) => value
}));

describe('Notification List', () => {
    it('should render notifications', () => {
        const dispatch = jest.fn();
        const state = { notifications: [{id: 'foo', body: 'foo', type: 'danger'}] };
        render(
        <NotificationContext.Provider value={{ state, dispatch }}>
            <NotificationList />
        </NotificationContext.Provider>
        );

        expect(screen.getByText('foo')).toBeInTheDocument();
    });
})
