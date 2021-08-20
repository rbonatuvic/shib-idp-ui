import { useGroupUiValidator } from './hooks';

it('should validate against a regex', () => {
    const validator = useGroupUiValidator();
    const addErrorSpy = jest.fn();
    const fail = validator({ validationRegex: '))(()' }, { validationRegex: { addError: addErrorSpy } });
    expect(addErrorSpy).toHaveBeenCalled();
    expect(validator({validationRegex: '/*'})).toBeUndefined();
});