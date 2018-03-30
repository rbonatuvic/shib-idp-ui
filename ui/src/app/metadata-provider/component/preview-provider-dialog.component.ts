import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDescriptorService } from '../service/entity-descriptor.service';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs/Subscription';
import * as XmlFormatter from 'xml-formatter';

@Component({
    selector: 'preview-provider-xml',
    templateUrl: './preview-provider-dialog.component.html'
})
export class PreviewProviderDialogComponent implements OnInit, OnDestroy {
    @Input() provider: MetadataProvider;

    sub: Subscription;
    xml: string;

    constructor(
        public activeModal: NgbActiveModal,
        private entityService: EntityDescriptorService
    ) {}

    preview(xml): void {
        const blob = new Blob([XmlFormatter(xml)], { type: 'text/xml;charset=utf-8' });
        FileSaver.saveAs(blob, `${ this.provider.serviceProviderName }.xml`);
    }

    ngOnInit(): void {
        let xml$ = this.entityService.preview(this.provider);
        this.sub = xml$.subscribe(xml => this.xml = xml);
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
} /* istanbul ignore next */
