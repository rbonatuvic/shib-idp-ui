import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { AppComponent } from './app.component';

import * as fromRoot from './core/reducer';
import { NotificationModule } from './notification/notification.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MockI18nService, MockI18nModule } from '../testing/i18n.stub';
import { I18nService } from './i18n/service/i18n.service';
import { NavigationService } from './core/service/navigation.service';
import { NavigationServiceStub } from '../testing/navigation-service.stub';
import { MockPageTitleComponent } from '../testing/page-title-component.stub';

@Component({
    template: `
        <app-root></app-root>
    `
})
class TestHostComponent {
    @ViewChild(AppComponent, {static: true})
    public componentUnderTest: AppComponent;
}

describe('AppComponent', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: AppComponent;
    let store: Store<fromRoot.State>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: I18nService, useClass: MockI18nService },
                { provide: NavigationService, useValue: NavigationServiceStub }
            ],
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                StoreModule.forRoot({
                    core: combineReducers(fromRoot.reducers)
                }),
                NotificationModule,
                MockI18nModule
            ],
            declarations: [
                AppComponent,
                MockPageTitleComponent,
                TestHostComponent
            ],
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should create the app', waitForAsync(() => {
        expect(app).toBeTruthy();
        expect(store.dispatch).toHaveBeenCalledTimes(3);
    }));

    it(`should have as title 'Shib-UI'`, waitForAsync(() => {
        expect(app.title).toEqual('Shib UI');
    }));

    describe('version format', () => {
        it('should return a formatted string', () => {
            expect(app.formatter({
                build: {
                    version: 'foo'
                },
                git: {
                    commit: {
                        id: 'bar'
                    }
                }
            })).toEqual('foo-bar');
        });
    });
});
