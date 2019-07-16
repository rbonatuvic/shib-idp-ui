import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { MetadataConfiguration } from '../model/metadata-configuration';
import { ConfigurationComponent } from './configuration.component';
import * as fromConfiguration from '../reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <configuration-page></configuration-page>
    `
})
class TestHostComponent {
    @ViewChild(ConfigurationComponent)
    public componentUnderTest: ConfigurationComponent;

    configuration: MetadataConfiguration = {
        dates: [],
        sections: []
    };
}

describe('Metadata Configuration Page Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ConfigurationComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                StoreModule.forRoot({
                    'metadata-configuration': combineReducers(fromConfiguration.reducers),
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

    it('should load metadata objects', async(() => {
        expect(app).toBeTruthy();
    }));
});
