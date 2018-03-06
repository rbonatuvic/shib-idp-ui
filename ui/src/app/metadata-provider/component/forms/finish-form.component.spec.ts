import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ProviderValueEmitter, ProviderStatusEmitter } from '../../service/provider-change-emitter.service';
import * as fromProviders from '../../reducer';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { ListValuesService } from '../../service/list-values.service';
import { EntityDescriptor } from '../../model/entity-descriptor';
import { FinishFormComponent } from './finish-form.component';
import { RouterStub, RouterLinkStubDirective } from '../../../../testing/router.stub';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';

describe('Finished Form Component', () => {
    let fixture: ComponentFixture<FinishFormComponent>;
    let instance: FinishFormComponent;
    let store: Store<fromProviders.ProviderState>;

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
                    'providers': combineReducers(fromProviders.reducers),
                }),
                NgbPopoverModule
            ],
            declarations: [
                FinishFormComponent,
                RouterLinkStubDirective
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(FinishFormComponent);
        instance = fixture.componentInstance;
        instance.provider = new EntityDescriptor({ entityId: 'foo', serviceProviderName: 'bar' });
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });
});
