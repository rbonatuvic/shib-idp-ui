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

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    edit(id: string): void {
        this.router.navigate(['../', 'edit', id], { relativeTo: this.activatedRoute.parent });
    }

    getItemType(items: Property): string {
        return items.widget ? items.widget.id : 'default';
    }

    getKeys(schema): string[] {
        return Object.keys(schema.properties);
    }

    get attributeList$(): Observable<{ key: string, label: string }[]> {
        /*
        if (this.property.widget && this.property.widget.hasOwnProperty('data')) {
            return of(this.property.widget.data);
        }
        if (this.property.widget && this.property.widget.hasOwnProperty('dataUrl')) {
            return this.attrService.query(this.property.widget.dataUrl);
        }
        */
        return of([]);
    }

    get width(): string {
        return `${ Math.floor(100 / this.configuration.dates.length) }%`;
    }
}
