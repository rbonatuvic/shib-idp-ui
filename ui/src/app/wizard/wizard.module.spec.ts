import { WizardModule } from './wizard.module';
import { TestBed } from '@angular/core/testing';
import { WizardService } from './service/wizard.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

describe('Wizard Module', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                EffectsModule.forRoot([]),
                WizardModule.forRoot()
            ]
        });
    });

    it('should compile', () => {
        expect(TestBed.get(WizardService)).toBeDefined();
    });
});
