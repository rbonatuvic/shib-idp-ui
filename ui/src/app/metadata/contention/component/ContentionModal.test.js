import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { ContentionModal } from './ContentionModal';
import { getContention } from '../ContentionContext';

jest.mock('../../../i18n/hooks', () => ({
    useTranslator: () => (value) => value,
    useTranslation: (value) => value
}));


describe('Contention Modal', () => {

    let contention, mockUseTheirs, mockUseOurs;

    beforeEach(() => {
        mockUseOurs = jest.fn();
        mockUseTheirs = jest.fn();
        contention = getContention({ name: 'baz', version: 0 }, { name: 'foo', version: 1 }, { name: 'bar', version: 2 });
        render(<ContentionModal
            show={true}
            theirs={contention.theirChanges}
            ours={contention.ourChanges}
            onUseOurs={mockUseOurs}
            onUseTheirs={mockUseTheirs} />);
    })


    it('should render', () => {
        expect(screen.getByText('message.data-version-contention')).toBeInTheDocument();
        expect(screen.getByText('message.contention-new-version')).toBeInTheDocument();
    });

    it('should allow the user to discard their changes', () => {
        fireEvent.click(screen.getByText('action.use-theirs'));
        expect(mockUseTheirs).toHaveBeenCalled();
    });

    it('should allow the user to resolve differences', () => {
        fireEvent.click(screen.getByText('action.use-mine'));
        expect(mockUseOurs).toHaveBeenCalled();
    });

    it('should allow the user to cancel if there are no real changes', () => {

        contention = getContention({ name: 'baz', version: 0 }, { name: 'foo', version: 1 }, { name: 'bar', version: 2 });
        render(<ContentionModal
            show={true}
            theirs={[]}
            ours={contention.ourChanges}
            onUseOurs={mockUseOurs}
            onUseTheirs={mockUseTheirs} />);

        fireEvent.click(screen.getByText('action.cancel'));
        expect(mockUseTheirs).toHaveBeenCalled();
    });
});