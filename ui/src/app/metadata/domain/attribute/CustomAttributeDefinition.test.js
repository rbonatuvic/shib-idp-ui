import { CustomAttributeDefinition } from "./CustomAttributeDefinition";

jest.mock('../../../App.constant', () => ({
    get API_BASE_PATH() {
        return '/';
    }
}));


describe('formatter', () => {
    it('should format the object passed for the json-schema-form', () => {
        expect(CustomAttributeDefinition.formatter(null)).toBeNull();

        expect(CustomAttributeDefinition.formatter({
            helpText: 'foo',
            attributeType: 'SELECTION_LIST',
            customAttrListDefinitions: [
                'foo'
            ],
            defaultValue: 'foo'
        })).toEqual({
            helpText: 'foo',
            attributeType: 'SELECTION_LIST',
            customAttrListDefinitions: [
                {
                    default: true,
                    value: 'foo'
                }
            ]
        });

        expect(CustomAttributeDefinition.formatter({
            attributeType: 'BOOLEAN',
            defaultValue: 'true',
            invert: 'true'
        })).toEqual({
            attributeType: 'BOOLEAN',
            defaultValueBoolean: true,
            invert: true
        });

        expect(CustomAttributeDefinition.formatter({
            attributeType: 'STRING',
            defaultValue: 'true'
        })).toEqual({
            attributeType: 'STRING',
            defaultValue: 'true'
        });
    });
});

describe('parser', () => {

    it('should parse the object provided to save to the server', () => {
        expect(CustomAttributeDefinition.parser(null)).toBeNull();

        expect(CustomAttributeDefinition.parser({
            attributeType: 'SELECTION_LIST',
            customAttrListDefinitions: [
                {
                    default: true,
                    value: 'foo'
                }
            ]
        })).toEqual({
            attributeType: 'SELECTION_LIST',
            customAttrListDefinitions: [
                'foo'
            ],
            defaultValue: 'foo'
        });

        expect(CustomAttributeDefinition.parser({
            attributeType: 'BOOLEAN',
            defaultValueBoolean: true
        })).toEqual({
            attributeType: 'BOOLEAN',
            defaultValue: true
        });

        expect(CustomAttributeDefinition.parser({
            attributeType: 'STRING',
            defaultValue: 'true'
        })).toEqual({
            attributeType: 'STRING',
            defaultValue: 'true'
        });
    });
});