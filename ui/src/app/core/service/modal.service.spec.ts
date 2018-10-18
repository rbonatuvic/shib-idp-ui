import { TestBed } from '@angular/core/testing';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalService } from './modal.service';

describe('Modal Service', () => {
    let service: ModalService;
    let ngbModal: NgbModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbModalModule.forRoot()
            ],
            providers: [
                ModalService
            ]
        });
        service = TestBed.get(ModalService);
        ngbModal = TestBed.get(NgbModal);
    });

    it('should instantiate', () => {
        expect(service).toBeDefined();
    });

    describe('modal.open method', () => {
        it('should open a new modal', () => {
            spyOn(ngbModal, 'open').and.callThrough();
            service.open(`<div></div>`, {});
            expect(ngbModal.open).toHaveBeenCalled();
        });

        it('should not add inputs to a modals scope if not provided a component', () => {
            spyOn(ngbModal, 'open').and.callThrough();
            service.open(`<div></div>`, {}, { foo: 'bar' });
            expect(ngbModal.open).toHaveBeenCalled();
        });

        it('should accept inputs to add to a new modals scope', () => {
            spyOn(ngbModal, 'open').and.callFake(() => {
                return {
                    result: Promise.resolve({}),
                    componentInstance: {}
                };
            });
            service.open(`<div></div>`, {}, { foo: 'bar' });
            expect(ngbModal.open).toHaveBeenCalled();
        });
    });
});
