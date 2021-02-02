import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { MetadataConfiguration } from '../model/metadata-configuration';
import * as fromConfiguration from '../reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { MetadataXmlComponent } from './metadata-xml.component';

@Component({
    template: `
        <metadata-xml-page></metadata-xml-page>
    `
})
class TestHostComponent {
    @ViewChild(MetadataXmlComponent, {static: true})
    public componentUnderTest: MetadataXmlComponent;
}

describe('Metadata Xml Page Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: MetadataXmlComponent;
    let store: Store<fromConfiguration.State>;

    beforeEach(waitForAsync(() => {
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
                MetadataXmlComponent,
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

    it('should load metadata objects', waitForAsync(() => {
        expect(app).toBeTruthy();
        expect(store.select).toHaveBeenCalledTimes(3);
    }));

    describe('preview method', () => {
        it('should dispatch an action', () => {
            app.preview();
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});
