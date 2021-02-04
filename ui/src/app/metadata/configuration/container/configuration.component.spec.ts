import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ConfigurationComponent } from './configuration.component';
import * as fromConfiguration from '../reducer';
import * as fromProviders from '../../provider/reducer';
import * as fromResolvers from '../../resolver/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <configuration-page></configuration-page>
    `
})
class TestHostComponent {
    @ViewChild(ConfigurationComponent, {static: true})
    public componentUnderTest: ConfigurationComponent;
}

describe('Metadata Configuration Page Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ConfigurationComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                StoreModule.forRoot({
                    'metadata-configuration': combineReducers(fromConfiguration.reducers),
                    'provider': combineReducers(fromProviders.reducers),
                    'resolver': combineReducers(fromResolvers.reducers)
                }),
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                ConfigurationComponent,
                TestHostComponent
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should load metadata objects', waitForAsync(() => {
        expect(app).toBeTruthy();
    }));
});
