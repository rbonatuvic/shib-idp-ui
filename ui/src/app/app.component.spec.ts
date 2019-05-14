import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { AppComponent } from './app.component';

import * as fromRoot from './core/reducer';
import { NotificationModule } from './notification/notification.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MockTranslatePipe, MockI18nService, MockI18nModule } from '../testing/i18n.stub';
import { I18nService } from './i18n/service/i18n.service';

@Component({
    template: `
        <app-root></app-root>
    `
})
class TestHostComponent {
    @ViewChild(AppComponent)
    public componentUnderTest: AppComponent;
}

describe('AppComponent', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: AppComponent;
    let store: Store<fromRoot.State>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: I18nService, useClass: MockI18nService }
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

    it('should create the app', async(() => {
        expect(app).toBeTruthy();
        expect(store.dispatch).toHaveBeenCalledTimes(3);
    }));

    it(`should have as title 'Shib-UI'`, async(() => {
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
