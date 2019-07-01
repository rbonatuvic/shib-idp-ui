import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MetadataConfiguration } from '../model/metadata-configuration';

@Component({
    selector: 'metadata-configuration',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-configuration.component.html',
    styleUrls: []
})
export class MetadataConfigurationComponent {
    @Input() configuration: MetadataConfiguration;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    edit(id: string): void {
        this.router.navigate(['../', 'edit', id], { relativeTo: this.activatedRoute.parent });
    }
}
