import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';
import * as fromProviders from '../../reducer';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { Provider } from '../../../domain/entity/provider';
import { DescriptorInfoFormComponent } from './descriptor-info-form.component';

import * as stubs from '../../../../testing/provider.stub';
import { SharedModule } from '../../../shared/shared.module';

@Component({
    template: `<descriptor-info-form [provider]="provider"></descriptor-info-form>`
})
class TestHostComponent {
    provider = new Provider({
        ...stubs.provider,
        serviceProviderSsoDescriptor: {
            protocolSupportEnum: 'foo',
            nameIdFormats: []
        }
    });

    @ViewChild(DescriptorInfoFormComponent)
    public formUnderTest: DescriptorInfoFormComponent;

    changeProvider(opts: any): void {
        this.provider = Object.assign({}, this.provider, opts);
    }

    addFormat(value: string): void {
        this.provider.serviceProviderSsoDescriptor.nameIdFormats.push(value);
    }
}

describe('Descriptor Info Form Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let store: Store<fromProviders.ProviderState>;
    let form: DescriptorInfoFormComponent;
    let fb: FormBuilder;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderValueEmitter,
                ProviderStatusEmitter,
                NgbPopoverConfig,
                ListValuesService
            ],
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule,
                StoreModule.forRoot({
                    'providers': combineReducers(fromProviders.reducers),
                }),
                NgbPopoverModule,
                SharedModule
            ],
            declarations: [
                DescriptorInfoFormComponent,
                TestHostComponent
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        form = instance.formUnderTest;
        fb = TestBed.get(FormBuilder);
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('removeFormat method', () => {
        it('should remove the nameid format at the given index', () => {
            instance.addFormat('foo');
            fixture.detectChanges();
            form.removeFormat(0);
            fixture.detectChanges();
            expect(form.nameIdFormats.length).toBe(0);
        });
    });

    describe('addFormat method', () => {
        it('should add a new nameid format', () => {
            form.addFormat();
            fixture.detectChanges();
            expect(form.nameIdFormats.length).toBe(1);
        });
    });

    describe('getRequiredControl method', () => {
        it('should create a form control with the required validator attached', () => {
            spyOn(fb, 'control').and.callThrough();
            form.getRequiredControl('foo');
            expect(fb.control).toHaveBeenCalledWith('foo', Validators.required);
        });
    });
});
