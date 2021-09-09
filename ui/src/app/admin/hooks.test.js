import {
    useGroupUiValidator,
    useRoles,
    useRole,
} from './hooks';

import useFetch from 'use-http';
import API_BASE_PATH from '../App.constant';

jest.mock('use-http');

it('should validate against a regex', () => {
    const validator = useGroupUiValidator();
    const addErrorSpy = jest.fn();
    const fail = validator({ validationRegex: '))(()' }, { validationRegex: { addError: addErrorSpy } });
    expect(addErrorSpy).toHaveBeenCalled();
    expect(validator({validationRegex: '/*'})).toBeUndefined();
});

describe('api hooks', () => {

    let mockPut;
    let mockGet;

    beforeEach(() => {

        mockPut = jest.fn().mockResolvedValue({ response: { ok: true } });
        mockGet = jest.fn().mockResolvedValue({ response: { ok: true } });

        useFetch.mockImplementation(() => {
            return {
                request: {
                    ok: true
                },
                put: mockPut,
                get: mockGet,
                error: null,
                response: {
                    status: 409
                }
            };
        });
    })

    describe('useRoles', () => {
        it('should call useFetch', () => {
            const opts = {};
            const roles = useRoles(opts);

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}/admin/roles`, opts)
        });
    });

    describe('useRole', () => {
        it('should call useFetch', () => {
            const opts = {
                cachePolicy: 'no-cache'
            };
            const role = useRole('foo');

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}/admin/roles/foo`, opts)
        });
    });
});
