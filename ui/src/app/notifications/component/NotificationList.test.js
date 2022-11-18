import React from 'react';
import { render, screen } from '@testing-library/react';

import { NotificationList } from './NotificationList';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch
}));

jest.mock('../../i18n/hooks', () => ({
    useTranslation: (value) => value
}));

jest.mock('../../store/notifications/NotificationSlice', () => ({
    useNotifications: () => [{id: 'foo', body: 'foo', type: 'danger'}]
}));

describe('Notification List', () => {
    it('should render notifications', () => {
        render(
            <NotificationList />
        );

        expect(screen.getByText('foo')).toBeInTheDocument();
    });
})
