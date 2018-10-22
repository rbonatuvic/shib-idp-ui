import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbDropdownModule, NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProviderFilterListComponent } from './provider-filter-list.component';
import * as fromRoot from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { EditorNavComponent } from '../../domain/component/editor-nav.component';
import { ValidFormIconComponent } from '../../../shared/component/valid-form-icon.component';
import { DeleteFilterComponent } from '../component/delete-filter.component';
import { NgbModalStub } from '../../../../testing/modal.stub';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `
        <provider-filter-list></provider-filter-list>
    `
})
class TestHostComponent {
    @ViewChild(ProviderFilterListComponent)
    public componentUnderTest: ProviderFilterListComponent;
}

describe('Provider Filter List Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderFilterListComponent;
    let store: Store<fromRoot.State>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule.forRoot(),
                RouterTestingModule,
                StoreModule.forRoot({
                    provider: combineReducers(fromRoot.reducers),
                    wizard: combineReducers(fromWizard.reducers)
                }),
                MockI18nModule
            ],
            declarations: [
                ProviderFilterListComponent,
                EditorNavComponent,
                ValidFormIconComponent,
                DeleteFilterComponent,
                TestHostComponent
            ],
            providers: [
                { provide: NgbModal, useClass: NgbModalStub }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));

    describe('remove method', () => {
        it('should dispatch an action to the store', () => {
            app.remove('foo');
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});
