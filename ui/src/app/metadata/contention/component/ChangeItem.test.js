import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { ChangeItem } from './ChangeItem';

jest.mock('../../../i18n/hooks', () => ({
    useTranslator: () => (value) => value,
    useTranslation: (value) => value
}));

describe('Contention Modal', () => {

    it('should render strings', () => {
        render(<ChangeItem
            item={{
                label: 'foo',
                value: 'bar',
                conflict: true
            }} />);
        expect(screen.getByText('foo')).toBeInTheDocument();
        expect(screen.getByText('bar')).toBeInTheDocument();
    });

    it('should render objects', () => {
        const item = {
            label: 'foo',
            value: {
                bar: 'baz'
            }
        };
        render(<ChangeItem
            item={item} />);
        expect(screen.getByText('baz')).toBeInTheDocument();
    });

    it('should render arrays of primitives', () => {
        const item = {
            label: 'foo',
            value: [
                'bar',
                'baz'
            ]
        };
        render(<ChangeItem
            item={item} />);
        expect(screen.getByText('baz')).toBeInTheDocument();
    });

    it('should render arrays of objects', () => {
        const item = {
            label: 'foo',
            value: [
                { barlabel: 'bar' },
                { bazlabel: 'baz' }
            ]
        };
        render(<ChangeItem
            item={item} />);
        expect(screen.getByText('baz')).toBeInTheDocument();
        expect(screen.getByText('bar')).toBeInTheDocument();
    });
});