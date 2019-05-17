import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProviderSelectComponent } from './provider-select.component';
import * as fromRoot from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { MetadataProvider } from '../../domain/model';

@Component({
    template: `
        <provider-select></provider-select>
    `
})
class TestHostComponent {
    @ViewChild(ProviderSelectComponent)
    public componentUnderTest: ProviderSelectComponent;
}

describe('Provider Select Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderSelectComponent;
    let store: Store<fromRoot.State>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                StoreModule.forRoot({
                    provider: combineReducers(fromRoot.reducers),
                    wizard: combineReducers(fromWizard.reducers)
                })
            ],
            declarations: [
                ProviderSelectComponent,
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

    describe('setDefinition method', () => {
        it('should not dispatch an action if no provider is defined', () => {
            app.setDefinition(null);
            expect(store.dispatch).not.toHaveBeenCalled();
        });
        it('should dispatch an action if a provider is defined', () => {
            app.setDefinition({} as MetadataProvider);
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});
