import { DynamicHttpMetadataProviderWizard } from './DynamicHttpMetadataProviderDefinition';
import schema from '../../../../testing/dynamic-http.schema';
const addErrorMockFn = jest.fn();

const providers = [
    {
        resourceId: 1,
        name: 'foo',
        xmlId: 'bar'
    },
    {
        resourceId: 2,
        name: 'baz',
        xmlId: 'xmlId'
    }
];

const e = {
    name: { addError: addErrorMockFn },
    metadataRequestURLConstructionScheme: {
        addError: addErrorMockFn,
        '@type': {
            addError: addErrorMockFn
        },
        match: {
            addError: addErrorMockFn
        }
    }
};

describe('validator function', () => {
    it('should NOT add an error if the regex provided is valid', () => {
        const validator = DynamicHttpMetadataProviderWizard.validator(providers);
        const errors = validator({
            name: 'baz text',
            metadataRequestURLConstructionScheme: {
                '@type': 'Regex',
                match: 'foo'
            }
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(0);
    });

    it('should add an error if the regex provided is not valid', () => {
        const validator = DynamicHttpMetadataProviderWizard.validator(providers);
        const errors = validator({
            name: 'baz test',
            metadataRequestURLConstructionScheme: {
                '@type': 'Regex',
                match: '*(*&^))'
            }
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(1);
    });
});