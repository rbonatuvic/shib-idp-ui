import { TestBed } from '@angular/core/testing';
import { CanDeactivateGuard, CanComponentDeactivate } from './can-deactivate.guard';
import { ActivatedRouteStub } from '../../../testing/activated-route.stub';

describe('Can Deactivate Guard Service', () => {
    let service: CanDeactivateGuard;
    let guarded: CanComponentDeactivate;
    let notGuarded: any;

    let activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    let child: ActivatedRouteStub = new ActivatedRouteStub();
    child.testParamMap = { form: 'common' };
    activatedRoute.firstChild = child;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CanDeactivateGuard
            ]
        });
        service = TestBed.get(CanDeactivateGuard);

        guarded = {
            canDeactivate: (currentRoute, currentState, nextState) => {
                return true;
            }
        };
        notGuarded = {};
    });

    it('should instantiate', () => {
        expect(service).toBeDefined();
    });

    describe('canDeactivate', () => {
        it('should check if the component has a canDeactivate method', () => {
            spyOn(guarded, 'canDeactivate');
            expect(service.canDeactivate(notGuarded, null, null, null)).toBe(true);
            service.canDeactivate(guarded, null, null, null);
            expect(guarded.canDeactivate).toHaveBeenCalled();
        });

        it('should return components result', () => {
            spyOn(guarded, 'canDeactivate').and.returnValue(false);
            expect(service.canDeactivate(guarded, null, null, null)).toBe(false);
        });
    });
});
