import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FilterListComponent } from './filter-list.component';
import { RouterModule } from '@angular/router';

describe('Filter List Component', () => {
    let fixture: ComponentFixture<FilterListComponent>;
    let instance: FilterListComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                RouterModule
            ],
            declarations: [
                FilterListComponent
            ],
        });

        fixture = TestBed.createComponent(FilterListComponent);
        instance = fixture.componentInstance;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
        expect(instance).toBeDefined();
    });
});
