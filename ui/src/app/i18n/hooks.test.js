import React from 'react';

import { translate, getMessage, useTranslation, useTranslator } from './hooks';

const msgs = { foo: 'bar { baz }' };

describe('getMessage', () => {
    it('should return the expected message based on the key', () => {
        expect(getMessage('foo', msgs)).toEqual('bar { baz }');
    });

    it('should return an empty string if messages are empty', () => {
        expect(getMessage('foo', {})).toEqual('');
    });

    it('should return provided string if message is not found', () => {
        expect(getMessage('foo', {bar: 'baz'})).toEqual('foo');
    });
})

describe('translate', () => {
    it('should translate the provided message', () => {
        const msg = getMessage('foo', msgs);
        expect(translate(msg, { baz: 'baz' })).toEqual('bar baz');
    });

    it('should return provided value if no interpolation strings are passed', () => {
        expect(translate('foo', {})).toEqual('foo');
    });

    it('should return an empty string if messages are empty', () => {
        expect(getMessage('foo', {})).toEqual('');
    });
});

describe('useTranslation hook', () => {
    let realUseContext;
    let useContextMock;
    beforeEach(() => {
        realUseContext = React.useContext;
        useContextMock = React.useContext = jest.fn();
    });
    // Cleanup mock
    afterEach(() => {
        React.useContext = realUseContext;
    });

    test("mock hook", () => {
        useContextMock.mockReturnValue(msgs);
        
        expect(useTranslation('foo', { baz: 'baz' })).toBe('bar baz');

        expect(useTranslation('foo')).toBe('bar { baz }');
    });
    
    //jest.mock('useContext')

    it('should translate the provided message', () => {
        const msg = getMessage('foo', { foo: 'bar { baz }' });
        expect(translate(msg, { baz: 'baz' })).toEqual('bar baz');
    });
});

describe('useTranslator hook', () => {
    let realUseContext;
    let useContextMock;
    beforeEach(() => {
        realUseContext = React.useContext;
        useContextMock = React.useContext = jest.fn();
    });
    // Cleanup mock
    afterEach(() => {
        React.useContext = realUseContext;
    });

    test("mock hook", () => {
        useContextMock.mockReturnValue(msgs);
        const translator = useTranslator();

        expect(translator('foo', { baz: 'baz' })).toBe('bar baz');
    });
});