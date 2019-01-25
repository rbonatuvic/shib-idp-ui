import { reducer, initialState as snapshot } from './admin-collection.reducer';
import * as fromAdmin from './admin-collection.reducer';
import {
    AdminCollectionActionTypes,
    LoadAdminSuccess,
    UpdateAdminSuccess,
    RemoveAdminSuccess
} from '../action/admin-collection.action';
import { Admin } from '../model/admin';

let users = <Admin[]>[
    {
        username: 'abc',
        role: 'ROLE_ADMIN',
        emailAddress: 'foo@bar.com',
        firstName: 'Jane',
        lastName: 'Doe'
    },
    {
        username: 'def',
        role: 'ROLE_USER',
        emailAddress: 'bar@baz.com',
        firstName: 'John',
        lastName: 'Doe'
    }
];

describe('Admin Collection Reducer', () => {
    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(snapshot, {} as any);

            expect(result).toEqual(snapshot);
        });
    });

    describe(`${AdminCollectionActionTypes.LOAD_ADMIN_SUCCESS}`, () => {
        it('should add the loaded filters to the collection', () => {
            spyOn(fromAdmin.adapter, 'addAll').and.callThrough();
            const action = new LoadAdminSuccess(users);
            const result = reducer(snapshot, action);
            expect(fromAdmin.adapter.addAll).toHaveBeenCalled();
        });
    });

    describe(`${AdminCollectionActionTypes.UPDATE_ADMIN_SUCCESS}`, () => {
        it('should update the filter in the collection', () => {
            spyOn(fromAdmin.adapter, 'updateOne').and.callThrough();
            const update = {
                id: 'abc',
                changes: { role: 'DELEGATED_ADMIN' }
            };
            const action = new UpdateAdminSuccess(update);
            const result = reducer(snapshot, action);
            expect(fromAdmin.adapter.updateOne).toHaveBeenCalled();
        });
    });

    describe(`${AdminCollectionActionTypes.REMOVE_ADMIN_SUCCESS}`, () => {
        it('should set saving to false', () => {
            const action = new RemoveAdminSuccess('abc');
            expect(reducer(snapshot, action).saving).toBe(false);
        });
    });

    describe('selector methods', () => {
        describe('getSelectedAdminId', () => {
            it('should return the state selectedAdminId', () => {
                expect(fromAdmin.getSelectedAdminId(snapshot)).toBe(snapshot.selectedAdminId);
            });
        });

        describe('getError', () => {
            it('should return the state saving', () => {
                expect(fromAdmin.getIsSaving(snapshot)).toBe(snapshot.saving);
            });
        });
    });
});
