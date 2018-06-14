import { ViewChild, Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewProviderComponent } from './new-provider.component';
import * as fromCollections from '../../domain/reducer';
import * as fromProvider from '../reducer';
import { CopyProviderComponent } from './copy-provider.component';
import { SharedModule } from '../../shared/shared.module';
import { NavigatorService } from '../../core/service/navigator.service';
import { I18nTextComponent } from '../../domain/component/i18n-text.component';

@Component({
    template: `<copy-provider-form
                (save)="onSave($event)"></copy-provider-form>`
})
class TestHostComponent {
    @ViewChild(CopyProviderComponent)
    public formUnderTest: CopyProviderComponent;

    onSave(event: any): void {}
}

describe('Copy Resolver Page', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let store: Store<fromCollections.State>;
    let instance: CopyProviderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    collections: combineReducers(fromCollections.reducers),
                    provider: combineReducers(fromProvider.reducers)
                }),
                ReactiveFormsModule,
                SharedModule
            ],
            declarations: [
                CopyProviderComponent,
                I18nTextComponent,
                TestHostComponent
            ],
            providers: [
                NavigatorService
            ]
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance.formUnderTest;
        store = TestBed.get(Store);
        fixture.detectChanges();

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('next method', () => {
        it('should dispatch an action to create a copy', () => {
            instance.next();
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('onChange method', () => {
        it('should dispatch an action to update the selected sections to copy', () => {
            instance.onChange('relyingPartyOverrides');
            expect(store.dispatch).toHaveBeenCalled();
            instance.onChange('relyingPartyOverrides');
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});
