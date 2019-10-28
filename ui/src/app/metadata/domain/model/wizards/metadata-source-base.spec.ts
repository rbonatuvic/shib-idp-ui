import { MetadataSourceBase } from './metadata-source-base';
import { MetadataResolver } from '../metadata-resolver';

describe('Metadata Source Base class', () => {

    let base = new MetadataSourceBase();
    const parser = base.parser;
    const formatter = base.formatter;
    const getValidators = base.getValidators;

    describe('parser', () => {
        it('should return the provided object', () => {
            let model = <MetadataResolver>{
                serviceProviderName: 'foo',
                id: 'FileBackedHttpMetadataProvider'
            };
            expect(
                parser(model)
            ).toEqual(
                model
            );
        });
    });

    describe('formatter', () => {
        it('should return the model', () => {
            let model = <MetadataResolver>{
                serviceProviderName: 'foo',
                id: 'FileBackedHttpMetadataProvider'
            };
            expect(
                formatter(model)
            ).toEqual(
                model
            );
        });
    });

    describe('getValidators method', () => {
        it('should return a list of validators for the ngx-schema-form', () => {
            expect(Object.keys(getValidators([]))).toEqual([
                '/',
                '/entityId',
                '/relyingPartyOverrides'
            ]);
        });

        describe('root validator', () => {
            it('should check for child errors', () => {
                const validators = getValidators([]);
                const validator = validators['/'];
                const getPropertySpy = jasmine.createSpy('getProperty');
                const relyingPartyOverrides = { foo: 'bar', baz: 'foo' };
                const value = { relyingPartyOverrides };
                const error = {
                    code: 'INVALID_SIGNING',
                    path: `#/relyingPartyOverrides`,
                    message: 'message.invalid-signing',
                    params: [relyingPartyOverrides]
                };
                spyOn(validators, '/relyingPartyOverrides').and.returnValue(error);

                const validated = validator(value, null, { getProperty: getPropertySpy });

                expect(validated).toEqual([error]);
            });
        });

        describe('relying party validator', () => {
            it('should check for child errors', () => {
                const validators = getValidators([]);
                const validator = validators['/relyingPartyOverrides'];
                const relyingPartyOverrides = { signAssertion: false, dontSignResponse: true };
                const error = {
                    code: 'INVALID_SIGNING',
                    path: `#/relyingPartyOverrides`,
                    message: 'message.invalid-signing',
                    params: [relyingPartyOverrides]
                };

                const validated = validator(relyingPartyOverrides, {path: '/relyingPartyOverrides'});

                expect(validated).toEqual(error);
            });

            it('should return null if no error detected', () => {
                const validators = getValidators([]);
                const validator = validators['/relyingPartyOverrides'];

                expect(validator({ signAssertion: true, dontSignResponse: true }, { path: '/relyingPartyOverrides' })).toEqual(null);
                expect(validator({ signAssertion: true, dontSignResponse: false }, { path: '/relyingPartyOverrides' })).toEqual(null);
                expect(validator({ signAssertion: false, dontSignResponse: false }, { path: '/relyingPartyOverrides' })).toEqual(null);
            });
        });
    });
});
