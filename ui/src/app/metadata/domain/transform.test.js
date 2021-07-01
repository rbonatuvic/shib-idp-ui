import { transformErrors } from './transform';

const errors = [
    {name: 'const'},
    {name: 'oneOf'},
    {name: 'pattern', property: '/email'},
    {name: 'pattern', property: 'foo'},
    {name: 'type', message: 'bar'},
    {name: 'type', message: 'should be string'}
];

it('should transform error messages', () => {
    expect(transformErrors(errors)).toEqual([
        { name: 'pattern', property: '/email', message: 'message.valid-email' },
        { name: 'pattern', property: 'foo', message: 'message.duration' },
        { name: 'type', message: 'bar' },
        { name: 'type', message: 'message.required' }
    ]);
});