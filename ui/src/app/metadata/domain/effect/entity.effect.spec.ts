import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';

import { TestActions, getActions } from '../../../../testing/effect.util';
import { EntityEffects } from './entity.effect';
import { EntityIdService } from '../service/entity-id.service';
import { ResolverService } from '../service/resolver.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalStub } from '../../../../testing/modal.stub';
import { EntityAttributesFilterEntity, FileBackedHttpMetadataResolver } from '../entity';

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
                    provide: ResolverService,
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
        providerService = TestBed.get(ResolverService);
        idService = TestBed.get(EntityIdService);
        modal = TestBed.get(NgbModal);
        actions$ = TestBed.get(Actions);
    });

    describe('openModal', () => {
        it('should open a modal window for a filter', fakeAsync(() => {
            spyOn(modal, 'open').and.returnValue({componentInstance: <any>{}});
            spyOn(idService, 'preview').and.returnValue(of('<foo></foo>'));
            effects.openModal({ id: 'foo', entity: new EntityAttributesFilterEntity()});
            expect(idService.preview).toHaveBeenCalled();
            tick(10);
            expect(modal.open).toHaveBeenCalled();
        }));

        it('should open a modal window for a provider', fakeAsync(() => {
            spyOn(modal, 'open').and.returnValue({ componentInstance: <any>{} });
            spyOn(providerService, 'preview').and.returnValue(of('<foo></foo>'));
            effects.openModal({id: 'foo', entity: new FileBackedHttpMetadataResolver()});
            expect(providerService.preview).toHaveBeenCalled();
            tick(10);
            expect(modal.open).toHaveBeenCalled();
        }));
    });
});
