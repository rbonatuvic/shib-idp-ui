import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDescriptorService } from '../../domain/service/entity-descriptor.service';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs/Subscription';
import * as XmlFormatter from 'xml-formatter';
import { MetadataEntity } from '../../domain/domain.type';

@Component({
    selector: 'preview-dialog',
    templateUrl: './preview-dialog.component.html'
})
export class PreviewDialogComponent {
    @Input() entity: MetadataEntity;
    @Input() xml: string;

    sub: Subscription;

    constructor(
        public activeModal: NgbActiveModal,
        private entityService: EntityDescriptorService
    ) {}

    preview(xml): void {
        const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
        FileSaver.saveAs(blob, `${ this.entity.name }.xml`);
    }
} /* istanbul ignore next */
