import { WizardService, ICONS } from './wizard.service';
import { TestBed } from '@angular/core/testing';

describe('Wizard Service', () => {
    let service: WizardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WizardService
            ]
        });

        service = TestBed.get(WizardService);
    });

    describe('getIcon method', () => {
        it('should return the check string for the last index', () => {
            expect(service.getIcon({ index: 'foo' }, { index: 'foo' })).toEqual(ICONS.CHECK);
        });
        it('should return the index icon for other indexes', () => {
            expect(service.getIcon({ index: 'foo' }, { index: 'bar' })).toEqual(ICONS.INDEX);
            expect(service.getIcon({ index: 'foo' }, null)).toEqual(ICONS.INDEX);
        });
    });
});
