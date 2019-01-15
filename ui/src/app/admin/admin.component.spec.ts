import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Admin Root Component', () => {
    let fixture: ComponentFixture<AdminComponent>;
    let instance: AdminComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AdminComponent
            ],
        });

        fixture = TestBed.createComponent(AdminComponent);
        instance = fixture.componentInstance;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
