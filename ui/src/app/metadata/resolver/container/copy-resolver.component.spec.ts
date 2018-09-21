import { ViewChild, Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import * as fromResolver from '../reducer';
import { CopyResolverComponent } from './copy-resolver.component';
import { SharedModule } from '../../../shared/shared.module';
import { NavigatorService } from '../../../core/service/navigator.service';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `<copy-resolver-form
                (save)="onSave($event)"></copy-resolver-form>`
})
class TestHostComponent {
    @ViewChild(CopyResolverComponent)
    public formUnderTest: CopyResolverComponent;

    onSave(event: any): void {}
}

describe('Copy Resolver Page', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let store: Store<fromResolver.State>;
    let instance: CopyResolverComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    resolver: combineReducers(fromResolver.reducers)
                }),
                ReactiveFormsModule,
                SharedModule,
                MockI18nModule
            ],
            declarations: [
                CopyResolverComponent,
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
