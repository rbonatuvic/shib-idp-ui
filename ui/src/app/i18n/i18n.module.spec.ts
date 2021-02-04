import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { I18nModule } from './i18n.module';
import { I18nService } from './service/i18n.service';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../core/core.module';

describe('I18n Module', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                EffectsModule.forRoot([]),
                I18nModule.forRoot(),
                HttpClientModule,
                CoreModule.forRoot()
            ]
        });
    });

    it('should compile', () => {
        expect(TestBed.get(I18nService)).toBeDefined();
    });
});
