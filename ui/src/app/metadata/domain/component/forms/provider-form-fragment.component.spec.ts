import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../../domain/service/provider-change-emitter.service';


describe('Resolver Form Fragment Component', () => {
    let fixture: ComponentFixture<ProviderFormFragmentComponent>;
    let instance: ProviderFormFragmentComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderValueEmitter,
                ProviderStatusEmitter
            ],
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule
            ],
            declarations: [
                ProviderFormFragmentComponent
            ],
        });

        fixture = TestBed.createComponent(ProviderFormFragmentComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });
});
