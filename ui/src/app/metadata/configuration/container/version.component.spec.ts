import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { VersionComponent } from './version.component';
import * as fromConfiguration from '../reducer';
import * as fromProviders from '../../provider/reducer';
import * as fromResolvers from '../../resolver/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <version-page></version-page>
    `
})
class TestHostComponent {
    @ViewChild(VersionComponent)
    public componentUnderTest: VersionComponent;
}

describe('Metadata Version Page Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: VersionComponent;

    beforeEach(async(() => {
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
                VersionComponent,
                TestHostComponent
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should compile', () => {
        expect(app).toBeTruthy();
    });
});
