import {
    useRoles,
    useRole,
} from './hooks';

import useFetch from 'use-http';
import API_BASE_PATH from '../App.constant';

jest.mock('use-http');

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