import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { AppComponent } from './app.component';

import { User } from './core/model/user';
import * as fromRoot from './core/reducer';
import { NotificationModule } from './notification/notification.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

describe('AppComponent', () => {
    let store: Store<fromRoot.State>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule.forRoot(),
                RouterTestingModule,
                StoreModule.forRoot({}),
                NotificationModule
            ],
            declarations: [
                AppComponent
            ],
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'Shib-UI'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('Shib UI');
    }));
});
