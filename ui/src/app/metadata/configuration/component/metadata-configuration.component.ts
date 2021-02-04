import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Metadata } from '../../domain/domain.type';
import { CONFIG_DATE_FORMAT } from '../configuration.values';

@Component({
    selector: 'metadata-configuration',
    templateUrl: './metadata-configuration.component.html',
    styleUrls: ['./metadata-configuration.component.scss']
})
export class MetadataConfigurationComponent implements OnChanges {
    @Input() configuration: MetadataConfiguration;
    @Input() definition: any;
    @Input() entity: Metadata;
    @Input() numbered = true;

    @Output() preview: EventEmitter<any> = new EventEmitter();
    @Output() onEdit: EventEmitter<string> = new EventEmitter();

    zero = false;

    DATE_FORMAT = CONFIG_DATE_FORMAT;

    ngOnChanges(): void {
        if (this.configuration) {
            this.zero = !this.configuration.sections.some(s => !!s.properties.length);
        }
    }

    get editable(): boolean {
        return !!this.onEdit.observers.length;
    }

    edit(id: string): void {
        this.onEdit.emit(id);
    }

    onPreview($event): void {
        this.preview.emit($event);
    }

    get width(): string {
        const columns = this.configuration.dates.length;
        return `${Math.floor(100 / (columns + 1)) }%`;
    }
}
