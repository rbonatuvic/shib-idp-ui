import { NameIDFilterWizard } from "./NameIdFilterDefinition";

jest.mock('../../../../App.constant', () => ({
    get API_BASE_PATH() {
        return '/';
    }
}));

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
    nameIdFormatFilterTarget: {
        addError: addErrorMockFn,
        nameIdFormatFilterTargetType: {
            addError: addErrorMockFn
        },
        value: {
            addError: addErrorMockFn
        }
    }
};

describe('validator function', () => {
    it('should validate against the provider names', () => {
        const validator = NameIDFilterWizard.validator(filters, 2);
        const errors = validator({
            name: 'foo'
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(1);
    });

    it('should validate against the provider names 2', () => {
        const validator = NameIDFilterWizard.validator(filters);
        const errors = validator({
            name: 'bar'
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(0);
    });

    it('should validate the regex target', () => {
        const validator = NameIDFilterWizard.validator(filters, 2);
        const errors = validator({
            name: 'baz2',
            nameIdFormatFilterTarget: {
                nameIdFormatFilterTargetType: 'REGEX',
                value: '()((*()*)(**'
            }
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(1);
    });

    it('should validate the regex target 2', () => {
        const validator = NameIDFilterWizard.validator(filters, 2);
        const errors = validator({
            name: 'baz2',
            nameIdFormatFilterTarget: {
                nameIdFormatFilterTargetType: 'REGEX',
                value: 'test'
            }
        }, e);

        expect(addErrorMockFn).toHaveBeenCalledTimes(0);
    });
});

describe('formatter', () => {
    it('should return the provided object with no changes', () => {
        expect(NameIDFilterWizard.formatter({})).toEqual({ '@type': 'NameIDFormat' });
    })
});
