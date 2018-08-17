import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProviderFilterListComponent } from './provider-filter-list.component';
import * as fromRoot from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { ProviderEditorNavComponent } from '../component/provider-editor-nav.component';
import { I18nTextComponent } from '../../../shared/component/i18n-text.component';
import { ValidFormIconComponent } from '../../../shared/component/valid-form-icon.component';

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
                })
            ],
            declarations: [
                ProviderFilterListComponent,
                ProviderEditorNavComponent,
                I18nTextComponent,
                ValidFormIconComponent,
                TestHostComponent
            ],
            providers: []
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
