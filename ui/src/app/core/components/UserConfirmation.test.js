import React from 'react';
import { act, render, fireEvent, waitFor, screen } from '@testing-library/react';
import { UserConfirmation, ConfirmWindow } from './UserConfirmation';

jest.mock('../../i18n/hooks', () => ({
    useTranslator: () => (value) => value,
    useTranslation: (value) => value
}));

const mockReload = jest.fn();

jest.mock('../utility/window', () => ({
    reload: () => mockReload()
}))

const mockIncludes = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        location: {
            pathname: {
                includes: mockIncludes
            }
        }
    })
}));

const TestWindow = ({getConfirmation, message}) => {
    React.useEffect(() => getConfirmation('foo', jest.fn()), [])
    return <span>{message}</span>;
}

describe('user confirmation context', () => {
    it('should render its children with a function', () => {
        render(<UserConfirmation>
            {(message, confirm, confirmCallback, setConfirm, getConfirmation) => <p><span>hi there</span> <TestWindow message={message} getConfirmation={getConfirmation} /></p>}
        </UserConfirmation>);
        expect(screen.getByText('hi there')).toBeInTheDocument();
        expect(screen.getByText('foo')).toBeInTheDocument();
    });
});

describe('confirmation window', () => {

    it('should provide buttons to confirm', async () => {

        const message = 'hi there';
        const confirm = true;
        const confirmCallback = jest.fn();
        const setConfirm = jest.fn();

        render(<ConfirmWindow message={message} confirm={confirm} confirmCallback={confirmCallback} setConfirm={setConfirm} /> );
        expect(screen.getByText('hi there')).toBeInTheDocument();

        fireEvent.click(screen.getByText('action.discard-changes'));

        expect(confirmCallback).toHaveBeenCalledWith(true);

    });

    it('should provide buttons to stop', async () => {

        const message = 'hi there';
        const confirm = true;
        const confirmCallback = jest.fn();
        const setConfirm = jest.fn();

        render(<ConfirmWindow message={message} confirm={confirm} confirmCallback={confirmCallback} setConfirm={setConfirm} />);
        expect(screen.getByText('hi there')).toBeInTheDocument();

        fireEvent.click(screen.getByText('action.cancel'));

        expect(confirmCallback).toHaveBeenCalledWith(false);

    });

    it('should redirect if on a provider', () => {
        mockIncludes.mockReturnValue(true);

        const message = 'hi there';
        const confirm = true;
        const confirmCallback = jest.fn();
        const setConfirm = jest.fn();

        render(<ConfirmWindow message={message} confirm={confirm} confirmCallback={confirmCallback} setConfirm={setConfirm} />);
        expect(screen.getByText('hi there')).toBeInTheDocument();

        fireEvent.click(screen.getByText('action.discard-changes'));

        expect(confirmCallback).toHaveBeenCalledWith(true); 

        expect(mockReload).toHaveBeenCalled();
    })
});

