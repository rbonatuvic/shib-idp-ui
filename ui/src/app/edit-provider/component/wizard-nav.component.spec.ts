import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { WizardNavComponent } from './wizard-nav.component';
import * as fromEditor from '../reducer';
import { ProviderEditorFormModule } from '../../metadata-provider/component/index';
import { DomainModule } from '../../domain/domain.module';

@Component({
    template:
        `<wizard-nav [index]="config.index"
            (onNext)="onNext()"
            (onPrevious)="onPrevious()"
            (onSave)="onSave()">
        </wizard-nav>`
})
class TestHostComponent {
    config: any = {
        index: 1
    };

    @ViewChild(WizardNavComponent)
    public navUnderTest: WizardNavComponent;

    configure(opts: any): void {
        this.config = Object.assign({}, this.config, opts);
    }

    onNext(): void {}
    onPrevious(): void {}
    onSave(): void {}
}

describe('Wizard Nav Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let store: Store<fromEditor.State>;
    let instance: TestHostComponent;
    let wizard: WizardNavComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    'edit-provider': combineReducers(fromEditor.reducers),
                }),
                ReactiveFormsModule,
                DomainModule,
                ProviderEditorFormModule
            ],
            declarations: [TestHostComponent, WizardNavComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        wizard = instance.navUnderTest;
        instance.configure({ index: 1 });
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('ngOnChanges lifecycle event', () => {
        it('should set currentPage when an index is provided', () => {
            instance.configure({index: 2});
            fixture.detectChanges();
            expect(wizard.currentPage).toBeDefined();
        });
    });
});
