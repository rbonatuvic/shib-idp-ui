import * as fromIndex from './';
import { MetadataResolver } from '../../metadata/domain/model';
import { User } from '../../core/model/user';

let resolvers: MetadataResolver[] = [
    { id: '1', entityId: 'foo', serviceEnabled: true, serviceProviderName: 'bar', createdDate: 'Date' } as MetadataResolver,
    { id: '2', entityId: 'baz', serviceEnabled: false, serviceProviderName: 'fin', createdDate: 'Date' } as MetadataResolver
];

let users: User[] = [
    {
        username: 'foo',
        role: 'ROLE_ADMIN',
        firstName: 'foo',
        lastName: 'bar',
        emailAddress: 'foo@bar.com'
    },
    {
        username: 'bar',
        role: 'ROLE_NONE',
        firstName: 'baz',
        lastName: 'foo',
        emailAddress: 'fooz@ball.com'
    }
];

describe('admin dashboard state selectors', () => {
    describe('getConfiguredAdminsFn', () => {
        it('should return all users without the `ROLE_NONE` role', () => {
            expect(fromIndex.getConfiguredAdminsFn(users).length).toBe(1);
        });
    });

    describe('getNewUsersFn', () => {
        it('should return all users with the `ROLE_NONE` role', () => {
            expect(fromIndex.getNewUsersFn(users).length).toBe(1);
        });
    });
    describe('totalUserFn', () => {
        it('should get the length of the provided array', () => {
            expect(fromIndex.totalUserFn(users)).toBe(2);
        });
    });
    describe('totalMetadataFn', () => {
        it('should get the length of the provided list after filtering enabled resolvers', () => {
            expect(fromIndex.totalMetadataFn(resolvers)).toBe(1);
        });
    });
    describe('totalActionsFn', () => {
        it('should return the sum of the total users and metadata', () => {
            expect(fromIndex.totalActionsFn(1, 2)).toBe(3);
        });
    });
});
