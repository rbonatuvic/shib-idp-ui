import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EnableMetadataComponent } from './enable-metadata.component';

import * as fromAdmin from '../reducer';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgbModalStub } from '../../../testing/modal.stub';
import { MockResolversListComponent } from '../../../testing/resolvers-list.component.stub';

@Component({
    template: `
        <enable-metadata></enable-metadata>
    `
})
class TestHostComponent {
    @ViewChild(EnableMetadataComponent, { static: true })
    public componentUnderTest: EnableMetadataComponent;
}

describe('Enable Metadata (modal) Component', () => {

    let app: EnableMetadataComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let store: Store<fromAdmin.State>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                StoreModule.forRoot({
                    admin: combineReducers(fromAdmin.reducers)
                })
            ],
            declarations: [
                EnableMetadataComponent,
                TestHostComponent,
                MockResolversListComponent
            ],
            providers: [
                {
                    provide: NgbModal,
                    useClass: NgbModalStub
                }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should compile without error', async(() => {
        expect(app).toBeTruthy();
    }));
});
