import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Property } from '../../domain/model/property';
import { Observable, of } from 'rxjs';
import { Metadata } from '../../domain/domain.type';
import { PreviewEntity } from '../../domain/action/entity.action';
import { ConfigurationState } from '../reducer';
import { Store } from '@ngrx/store';

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

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private store: Store<ConfigurationState>
    ) {}

    edit(id: string): void {
        this.router.navigate(['../', 'edit', id], { relativeTo: this.activatedRoute.parent });
    }

    onPreview($event): void {
        this.store.dispatch(new PreviewEntity({
            id: $event.data,
            entity: this.definition.getEntity(this.entity)
        }));
    }

    get width(): string {
        const columns = this.configuration.dates.length;
        return `${Math.floor(100 / (columns + 1)) }%`;
    }
}
