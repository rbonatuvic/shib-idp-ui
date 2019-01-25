import * as fromIndex from './';
import { MetadataResolver } from '../../metadata/domain/model';
import { User } from '../../core/model/user';

// export const totalUserFn = (users) => users.length;
// export const totalMetadataFn = (md) => md.filter(obj => !obj.serviceEnabled).length;
// export const totalActionsFn = (users, md) => md + users;

let resolvers: MetadataResolver[] = [
    { id: '1', entityId: 'foo', serviceEnabled: true, serviceProviderName: 'bar', createdDate: 'Date' } as MetadataResolver,
    { id: '2', entityId: 'baz', serviceEnabled: false, serviceProviderName: 'fin', createdDate: 'Date' } as MetadataResolver
];

let users: User[] = [
    {
        username: 'foo',
        role: 'admin',
        firstName: 'foo',
        lastName: 'bar',
        emailAddress: 'foo@bar.com'
    }
];

describe('admin dashboard state selectors', () => {
    describe('totalUserFn', () => {
        it('should get the length of the provided array', () => {
            expect(fromIndex.totalUserFn(users)).toBe(1);
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
