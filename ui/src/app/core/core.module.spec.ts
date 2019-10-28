import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from './core.module';
import { UserService } from './service/user.service';
import { HttpClientModule } from '@angular/common/http';

describe('Core Module', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                EffectsModule.forRoot([]),
                CoreModule.forRoot(),
                HttpClientModule
            ]
        });
    });

    it('should compile', () => {
        expect(TestBed.get(UserService)).toBeDefined();
    });
});
