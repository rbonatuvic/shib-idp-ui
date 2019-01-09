import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserPageComponent } from './user.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('User Root Component', () => {
    let fixture: ComponentFixture<UserPageComponent>;
    let instance: UserPageComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                UserPageComponent
            ],
        });

        fixture = TestBed.createComponent(UserPageComponent);
        instance = fixture.componentInstance;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
