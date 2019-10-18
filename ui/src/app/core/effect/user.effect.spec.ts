import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { UserEffects } from './user.effect';
import { Subject, of, throwError } from 'rxjs';
import { UserService } from '../service/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadRoleSuccess, LoadRoleFail, LoadRoleRequest } from '../action/configuration.action';

describe('User Effects', () => {
    let effects: UserEffects;
    let actions: Subject<any>;
    let userService: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                UserEffects,
                UserService,
                provideMockActions(() => actions),
            ],
        });

        effects = TestBed.get(UserEffects);
        userService = TestBed.get(UserService);
    });

    it('should fire a success action', () => {
        spyOn(userService, 'getRoles').and.returnValue(of(['ROLE_ADMIN']));
        actions = new ReplaySubject(1);

        actions.next(new LoadRoleRequest());

        effects.loadRoles$.subscribe(result => {
            expect(result).toEqual(new LoadRoleSuccess(['ROLE_ADMIN']));
        });
    });

    it('should fire an error action', () => {
        let err = new Error('404');
        spyOn(userService, 'getRoles').and.returnValue(throwError(err));
        actions = new ReplaySubject(1);

        actions.next(new LoadRoleRequest());

        effects.loadRoles$.subscribe(result => {
            expect(result).toEqual(new LoadRoleFail());
        });
    });
});
