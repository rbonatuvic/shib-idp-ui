import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Metadata } from '../../domain/domain.type';

@Component({
    selector: 'metadata-configuration',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-configuration.component.html',
    styleUrls: []
})
export class MetadataConfigurationComponent {
    @Input() configuration: MetadataConfiguration;
    @Input() definition: any;
    @Input() entity: Metadata;
    @Input() numbered = true;
    @Input() editable = true;

    @Output() preview: EventEmitter<any> = new EventEmitter();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

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