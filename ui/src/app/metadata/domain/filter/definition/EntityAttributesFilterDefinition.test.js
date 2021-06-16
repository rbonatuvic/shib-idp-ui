import { EntityAttributesFilterWizard } from "./EntityAttributesFilterDefinition";
const addErrorMockFn = jest.fn();

const filters = [
    {
        resourceId: 1,
        name: 'foo'
    },
    {
        resourceId: 2,
        name: 'baz'
    }
];

const e = {
    name: { addError: addErrorMockFn },
    entityAttributesFilterTarget: {
        addError: addErrorMockFn,
        entityAttributesFilterTargetType: {
            addError: addErrorMockFn
        },
        value: {
            addError: addErrorMockFn
        }
    }
};

describe('validator function', () => {
    it('should validate against the provider names', () => {
        const validator = EntityAttributesFilterWizard.validator(filters, 2);
        const errors = validator({
            name: 'foo'
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(1);
    });

    it('should validate against the provider names 2', () => {
        const validator = EntityAttributesFilterWizard.validator(filters);
        const errors = validator({
            name: 'bar'
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(0);
    });

    it('should validate the regex target', () => {
        const validator = EntityAttributesFilterWizard.validator(filters, 2);
        const errors = validator({
            name: 'baz2',
            entityAttributesFilterTarget: {
                entityAttributesFilterTargetType: 'REGEX',
                value: '()((*()*)(**'
            }
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(1);
    });

    it('should validate the regex target 2', () => {
        const validator = EntityAttributesFilterWizard.validator(filters, 2);
        const errors = validator({
            name: 'baz2',
            entityAttributesFilterTarget: {
                entityAttributesFilterTargetType: 'REGEX',
                value: 'test'
            }
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(0);
    });
});

describe('formatter', () => {
    it('should return the provided object with no changes', () => {
        expect(EntityAttributesFilterWizard.formatter({})).toEqual({ '@type': 'EntityAttributes' });
    })
});

describe('parser', () => {
    it('should return the provided object with no changes', () => {
        expect(EntityAttributesFilterWizard.parser({})).toEqual({
            relyingPartyOverrides: {}
        });

        expect(EntityAttributesFilterWizard.parser({
            relyingPartyOverrides: {
                foo: null
            }
        })).toEqual({
            relyingPartyOverrides: {}
        });
    })
});

describe('warnings', () => {
    it('should return warnings based on provided data', () => {
        expect(EntityAttributesFilterWizard.warnings({
            relyingPartyOverrides: {
                signAssertion: false,
                dontSignResponse: true
            }
        })).toEqual({
            'options': [
                'message.invalid-signing'
            ]
        });
    })

    it('should return no warnings', () => {
        expect(EntityAttributesFilterWizard.warnings({
            relyingPartyOverrides: {
                signAssertion: true,
                dontSignResponse: true
            }
        })).toEqual({});
    })
});

describe('display', () => {
    it('should return the provided object with no changes', () => {
        expect(EntityAttributesFilterWizard.display({})).toEqual({});
    })
});