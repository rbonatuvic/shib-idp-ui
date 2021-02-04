import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { MetadataPageComponent } from './metadata.component';

import * as fromRoot from '../core/reducer';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    template: `
        <metadata-page></metadata-page>
    `
})
class TestHostComponent {
    @ViewChild(MetadataPageComponent, {static: true})
    public componentUnderTest: MetadataPageComponent;
}

describe('Metadata Root Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: MetadataPageComponent;
    let store: Store<fromRoot.State>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                StoreModule.forRoot({
                    core: combineReducers(fromRoot.reducers)
                })
            ],
            declarations: [
                MetadataPageComponent,
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

    it('should load metadata objects', waitForAsync(() => {
        expect(app).toBeTruthy();
    }));
});
