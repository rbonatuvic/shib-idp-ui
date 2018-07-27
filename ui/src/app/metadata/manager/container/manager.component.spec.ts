import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ManagerComponent } from './manager.component';
import { RouterModule, Router } from '@angular/router';
import { RouterStub, RouterLinkStubDirective, RouterOutletStubComponent } from '../../../../testing/router.stub';

describe('Metadata Manager Parent Page', () => {
    let fixture: ComponentFixture<ManagerComponent>;
    let instance: ManagerComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useClass: RouterStub }
            ],
            imports: [
                NoopAnimationsModule,
            ],
            declarations: [
                ManagerComponent,
                RouterLinkStubDirective,
                RouterOutletStubComponent
            ],
        });

        fixture = TestBed.createComponent(ManagerComponent);
        instance = fixture.componentInstance;
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
