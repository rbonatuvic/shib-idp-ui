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
    });
});
