import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Property } from '../../domain/model/property';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'metadata-configuration',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-configuration.component.html',
    styleUrls: []
})
export class MetadataConfigurationComponent {
    @Input() configuration: MetadataConfiguration;
    @Input() numbered = true;
    @Input() editable = true;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    edit(id: string): void {
        this.router.navigate(['../', 'edit', id], { relativeTo: this.activatedRoute.parent });
    }

    get width(): string {
        const columns = this.configuration.dates.length;
        return `${Math.floor(100 / (columns + 1)) }%`;
    }
}
