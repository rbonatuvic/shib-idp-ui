import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { empty, Observable, of } from 'rxjs';

import { TestActions, getActions } from '../../../testing/effect.util';
import { PreviewEntity } from '../action/entity.action';
import { EntityEffects } from './entity.effect';
import { EntityIdService } from '../service/entity-id.service';
import { EntityDescriptorService } from '../service/entity-descriptor.service';
import { Filter } from '../entity/filter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalStub } from '../../../testing/modal.stub';

describe('Entity Effects', () => {
    let effects: EntityEffects;
    let providerService: any;
    let idService: any;
    let modal: any;
    let actions$: TestActions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EntityEffects,
                {
                    provide: NgbModal,
                    useClass: NgbModalStub
                },
                {
                    provide: EntityDescriptorService,
                    useValue: { preview: () => {} },
                },
                {
                    provide: EntityIdService,
                    useValue: { preview: () => { } },
                },
                { provide: Actions, useFactory: getActions }
            ],
        });

        effects = TestBed.get(EntityEffects);
        providerService = TestBed.get(EntityDescriptorService);
        idService = TestBed.get(EntityIdService);
        modal = TestBed.get(NgbModal);
        actions$ = TestBed.get(Actions);
    });

    describe('openModal', () => {
        it('should open a modal window', fakeAsync(() => {
            spyOn(modal, 'open').and.returnValue({componentInstance: <any>{}});
            spyOn(idService, 'preview').and.returnValue(of('<foo></foo>'));
            effects.openModal(new Filter());
            expect(idService.preview).toHaveBeenCalled();
            tick(10);
            expect(modal.open).toHaveBeenCalled();
        }));
    });
});
