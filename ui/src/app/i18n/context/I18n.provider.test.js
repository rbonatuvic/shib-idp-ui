import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nProvider } from './I18n.provider';

const getFn = jest.fn();
const okFn = jest.fn();

const mockUseFetch = {
    get: getFn,
    response: {}
};

Object.defineProperty(mockUseFetch.response, 'ok', {
    get: okFn
});

jest.mock('use-http', () => () => mockUseFetch);

describe('i18nProvider messages defined', () => {

    beforeEach(() => {
        getFn.mockReturnValue(Promise.resolve({
            'foo.bar': 'bar baz'
        }));
        okFn.mockReturnValueOnce(true);
    });

    it('should display translated text', async () => {
        render(<I18nProvider>
            <div>test</div>
        </I18nProvider>);

        await waitFor(() => expect(screen.getByText('test')).toBeInTheDocument());
    });
});

describe('i18nProvider messages empty', () => {

    beforeEach(() => {
        getFn.mockReturnValue(Promise.resolve());
        okFn.mockReturnValueOnce(false);
    });

    it('should NOT display translated text', async () => {
        render(<I18nProvider>
            <div>test</div>
        </I18nProvider>);

        await waitFor(() => expect(screen.getByText('no messages found')).toBeInTheDocument());
    });
});
