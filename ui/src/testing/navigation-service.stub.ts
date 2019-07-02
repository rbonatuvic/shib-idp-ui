import { of } from 'rxjs';
import { NavigationService } from '../app/core/service/navigation.service';

export const definition: unknown = {
    emitter: of([]),
    actionList: [],
    addAction: jasmine.createSpy('navService')
};

export const NavigationServiceStub = definition as NavigationService;
