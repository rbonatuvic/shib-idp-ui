import { get_cookie } from './get_cookie';

Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: 'XSRF=FOOBAR',
});

it('should retrieve the XSRF Cookie', () => {
    expect(get_cookie('XSRF')).toEqual('FOOBAR');
});