import React from 'react';
import {  render, screen } from '@testing-library/react';
import { SessionModal } from './SessionModal';

jest.mock('../../i18n/hooks', () => ({
    useTranslator: () => (value) => value,
    useTranslation: (value) => value
}));

describe('session modal', () => {

    it('should provide buttons to confirm', async () => {

        render(<SessionModal show={true} />);
        expect(screen.getByText('message.session-timeout-heading')).toBeInTheDocument();

    });
});