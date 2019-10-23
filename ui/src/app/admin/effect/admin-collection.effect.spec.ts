import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, Observable, of, ReplaySubject } from 'rxjs';

import { AdminCollectionEffects } from './admin-collection.effect';
import { AdminService } from '../service/admin.service';
import { Admin } from '../model/admin';
import { LoadAdminRequest, LoadAdminSuccess, UpdateAdminSuccess } from '../action/admin-collection.action';
import { AddNotification, ADD_NOTIFICATION } from '../../notification/action/notification.action';
import { NotificationType, Notification } from '../../notification/model/notification';

describe('Admin Collection Effects', () => {
    let effects: AdminCollectionEffects;
    let actions: Subject<any>;

    let admin: Admin = {
        username: 'foo',
        firstName: 'bar',
        lastName: 'baz',
        role: 'ROLE_ADMIN',
        emailAddress: 'foo@bar.baz'
    };

    let mockAdminService = {
        query: (): Observable<Admin[]> => of([admin]),
        queryByRole: (role: string): Observable<Admin[]> => of([admin]),
        update: (user: Admin): Observable<Admin> => of(admin),
        remove: (userId: string): Observable<boolean> => of(true)
    };

    let adminService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: AdminService, useValue: mockAdminService },
                AdminCollectionEffects,
                provideMockActions(() => actions),
            ],
        });

        effects = TestBed.get(AdminCollectionEffects);
        adminService = TestBed.get(AdminService);
    });

    describe(`loadAdminRequest$ effect`, () => {
        it('should load admins and fire a success action', () => {
            spyOn(adminService, 'query').and.returnValue(of([admin]));
            actions = new ReplaySubject(1);

            actions.next(new LoadAdminRequest());

            effects.loadAdminRequest$.subscribe(result => {
                expect(result).toEqual(new LoadAdminSuccess([admin]));
            });
        });
    });

    describe('updateAdminRoleReload$ effect', () => {
        it('should reload the admins when the admin is updated', () => {
            actions = new ReplaySubject(1);

            actions.next(new UpdateAdminSuccess({id: 'foo', changes: { ...admin }}));

            effects.updateAdminRoleReload$.subscribe(result => {
                expect(result).toEqual(new LoadAdminRequest());
            });
        });
    });

    describe('updateAdminRoleSuccess$', () => {
        it('should fire a notification to the notification service', () => {
            let payload = { id: 'foo', changes: { ...admin } };
            actions = new ReplaySubject(1);

            actions.next(new UpdateAdminSuccess(payload));

            effects.updateAdminRoleSuccess$.subscribe(result => {
                expect(result.type).toEqual(ADD_NOTIFICATION);
            });
        });
    });
});
