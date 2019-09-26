import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    @Input() editable = true;

    @Output() preview: EventEmitter<any> = new EventEmitter();

    zero = false;

    DATE_FORMAT = CONFIG_DATE_FORMAT;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnChanges(): void {
        this.zero = !this.configuration.sections.some(s => !!s.properties.length);
    }

    edit(id: string): void {
        this.router.navigate(['../', 'edit', id], { relativeTo: this.activatedRoute.parent });
    }

    onPreview($event): void {
        this.preview.emit($event);
    }

    get width(): string {
        const columns = this.configuration.dates.length;
        return `${Math.floor(100 / (columns + 1)) }%`;
    }
}
