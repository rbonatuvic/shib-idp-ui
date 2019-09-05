import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetadataFilter } from '../../domain/model';
import { MetadataConfigurationService } from '../service/configuration.service';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { PreviewEntity } from '../../domain/action/entity.action';
import { Metadata } from '../../domain/domain.type';
import * as fromRoot from '../../../app.reducer';

@Component({
    selector: 'filter-configuration-list-item',
    templateUrl: './filter-configuration-list-item.component.html'
})
export class FilterConfigurationListItemComponent implements OnChanges {
    @Input() filter: MetadataFilter;
    @Input() index: number;
    @Input() isFirst: boolean;
    @Input() isLast: boolean;
    @Input() editable: boolean;

    @Output() onUpdateOrderUp: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onUpdateOrderDown: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onRemove: EventEmitter<string> = new EventEmitter();

    open = false;
    configuration: MetadataConfiguration;
    definition: any;

    constructor(
        private configService: MetadataConfigurationService,
        private store: Store<fromRoot.State>
    ) {}

    onPreview($event: { data: any, parent: Metadata }): void {
        this.store.dispatch(new PreviewEntity({
            id: $event.data,
            entity: this.definition.getEntity($event.parent)
        }));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filter) {
            this.definition = this.configService.getDefinition(this.filter['@type']);
            this.configService.loadSchema(this.definition.schema).subscribe(schema => {
                this.configuration = this.configService.getMetadataConfiguration(
                    this.filter,
                    this.definition,
                    schema
                );
            });
        }
    }
}
