import { BaseProviderDefinition } from './BaseProviderDefinition';
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
    xmlId: { addError: addErrorMockFn }
};

describe('validator function', () => {
    it('should validate against the providers', () => {
        const validator = BaseProviderDefinition.validator(providers, 2);
        const errors = validator({
            name: 'foo',
            xmlId: 'xmlId'
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(2);
    });

    it('should check against the current id', () => {
        const validator = BaseProviderDefinition.validator(providers, 1);
        const errors = validator({
            name: 'foo',
            xmlId: 'naz'
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(1);
    });
});

describe('parser function', () => {

    const base = {
        metadataFilters: [
            {
                resourceId: 'foo',
                name: 'foo',
                '@type': 'NameIDFormat'
            }
        ]
    };

    const changes = {
        metadataFilters: [
            {
                '@type': "RequiredValidUntil",
                audId: 19,
                createdBy: "root",
                createdDate: "2021-06-11T13:29:18.384219",
                current: false,
                filterEnabled: false,
                maxValidityInterval: "PT30S",
                resourceId: "299feea8-3e2c-433e-bc2e-48d28bf84a8c"
            }
        ]
    };

    it('should validate against the providers', () => {
        const parsed = BaseProviderDefinition.parser(
            changes, base
        );

        expect(parsed.metadataFilters.length).toBe(2);
    });
});

describe('formatter function', () => {

    const md = {
        metadataFilters: [
            {
                resourceId: 'foo',
                name: 'foo',
                '@type': 'NameIDFormat'
            },
            {
                '@type': "RequiredValidUntil",
                audId: 19,
                createdBy: "root",
                createdDate: "2021-06-11T13:29:18.384219",
                current: false,
                filterEnabled: false,
                maxValidityInterval: "PT30S",
                resourceId: "299feea8-3e2c-433e-bc2e-48d28bf84a8c"
            }
        ]
    };

    it('should validate against the providers', () => {
        const parsed = BaseProviderDefinition.formatter(
            md, schema
        );

        expect(parsed.metadataFilters.length).toBe(3);
    });

    it('should return no changes if no filters are on the provider', () => {
        const parsed = BaseProviderDefinition.formatter(
            {}, schema
        );

        expect(parsed.metadataFilters).toBeUndefined();
    });

    it('should return no changes if no provider is passed', () => {
        const parsed = BaseProviderDefinition.formatter(
            null, schema
        );

        expect(parsed).toBeNull();
    });
});

describe('display function', () => {

    const md = {
        metadataFilters: [
            {
                resourceId: 'foo',
                name: 'foo',
                '@type': 'NameIDFormat'
            },
            {
                '@type': "RequiredValidUntil",
                audId: 19,
                createdBy: "root",
                createdDate: "2021-06-11T13:29:18.384219",
                current: false,
                filterEnabled: false,
                maxValidityInterval: "PT30S",
                resourceId: "299feea8-3e2c-433e-bc2e-48d28bf84a8c"
            }
        ]
    };

    it('should validate against the providers', () => {
        const parsed = BaseProviderDefinition.display(md);
        expect(Array.isArray(parsed)).toBe(false);
    });

    it('should return an unmodified provider if no filters are present', () => {
        const local = {};
        const parsed = BaseProviderDefinition.display(local);
        expect(parsed).toEqual(local);
    });
});