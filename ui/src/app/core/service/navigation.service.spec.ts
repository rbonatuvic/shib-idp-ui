import { TestBed, waitForAsync } from '@angular/core/testing';

import { NavigationService } from './navigation.service';

describe('Navigation Service', () => {
    let service: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                NavigationService
            ]
        });
        service = TestBed.get(NavigationService);
    });

    it('should instantiate', () => {
        expect(service).toBeDefined();
    });

    describe('addAction method', () => {
        it('should add a navigation option to the list of actions', () => {
            service.addAction('foo', {
                action: () => {},
                category: 'bar',
                label: 'baz',
                content: 'something'
            });

            expect(service.actionList.length).toBe(1);
        });

        it('should emit the value from an observable when an action is added', (done: DoneFn) => {
            const action = {
                action: () => { },
                category: 'bar',
                label: 'baz',
                content: 'something'
            };
            const actionName = 'foo';
            service.addAction(actionName, action);

            service.emitter.subscribe((actions) => {
                expect(actions.length).toBe(1);
                done();
            });
        });
    });
});
