import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import * as fromMetadata from '../../../metadata.reducer';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { FinishFormComponent } from './finish-form.component';
import { RouterStub, RouterLinkStubDirective } from '../../../../../testing/router.stub';
import { ActivatedRouteStub } from '../../../../../testing/activated-route.stub';

import * as stubs from '../../../../../testing/resolver.stub';
import { I18nTextComponent } from '../../../domain/component/i18n-text.component';
import { FileBackedHttpMetadataResolver } from '../../entity';
import { InputDefaultsDirective } from '../../../../shared/directive/input-defaults.directive';

@Component({
    template: `<finish-form [resolver]="resolver"></finish-form>`
})
class TestHostComponent {
    resolver = new FileBackedHttpMetadataResolver({
        ...stubs.resolver
    });

    @ViewChild(FinishFormComponent)
    public formUnderTest: FinishFormComponent;

    changeProvider(opts: any): void {
        this.resolver = Object.assign({}, this.resolver, opts);
    }
}

describe('Finished Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let store: Store<fromMetadata.MetadataState>;
    let form: FinishFormComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderValueEmitter,
                ProviderStatusEmitter,
                NgbPopoverConfig,
                ListValuesService,
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useClass: ActivatedRouteStub }
            ],
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule,
                StoreModule.forRoot({
                    'metadata': combineReducers(fromMetadata.reducers),
                }),
                NgbPopoverModule
            ],
            declarations: [
                FinishFormComponent,
                RouterLinkStubDirective,
                I18nTextComponent,
                InputDefaultsDirective,
                TestHostComponent
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        form = instance.formUnderTest;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('ngOnChanges lifecycle event', () => {
        it('should reset the form', () => {
            spyOn(form.form, 'reset').and.callThrough();
            instance.changeProvider({
                serviceEnabled: true
            });
            fixture.detectChanges();
            expect(form.form.reset).toHaveBeenCalled();
        });

        xit('should reset the form with serviceEnabled = false if no resolver', () => {
            spyOn(form.form, 'reset').and.callThrough();
            delete instance.resolver;
            fixture.detectChanges();
            expect(form.form.reset).toHaveBeenCalled();
        });
    });
});
