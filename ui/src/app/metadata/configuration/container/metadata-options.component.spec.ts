import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { MetadataConfiguration } from '../model/metadata-configuration';
import * as fromConfiguration from '../reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { MetadataOptionsComponent } from './metadata-options.component';

@Component({
    selector: 'metadata-configuration',
    template: ``
})
class MetadataConfigurationComponent {
    @Input() configuration: MetadataConfiguration;
}

@Component({
    template: `
        <metadata-options-page></metadata-options-page>
    `
})
class TestHostComponent {
    @ViewChild(MetadataOptionsComponent)
    public componentUnderTest: MetadataOptionsComponent;

    configuration: MetadataConfiguration = { sections: [] };
}

describe('Metadata Options Page Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: MetadataOptionsComponent;
    let store: Store<fromConfiguration.State>;

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
                MetadataOptionsComponent,
                MetadataConfigurationComponent,
                TestHostComponent
            ],
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');
        spyOn(store, 'select');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should load metadata objects', async(() => {
        expect(app).toBeTruthy();
        expect(store.select).toHaveBeenCalled();
    }));
});
