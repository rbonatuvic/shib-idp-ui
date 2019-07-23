import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MetadataFilter } from '../../domain/model';
import { MetadataConfigurationService } from '../service/configuration.service';
import { Wizard } from '../../../wizard/model';
import { MetadataConfiguration } from '../model/metadata-configuration';

@Component({
    selector: 'filter-configuration-list-item',
    templateUrl: './filter-configuration-list-item.component.html'
})
export class FilterConfigurationListItemComponent implements OnChanges {
    @Input() filter: MetadataFilter;
    @Input() index: number;
    @Input() isFirst: boolean;
    @Input() isLast: boolean;

    @Output() onUpdateOrderUp: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onUpdateOrderDown: EventEmitter<MetadataFilter> = new EventEmitter();
    @Output() onRemove: EventEmitter<string> = new EventEmitter();

    open = false;
    configuration: MetadataConfiguration;

    constructor(
        private configService: MetadataConfigurationService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filter) {
            const definition = this.configService.getDefinition(this.filter['@type']);
            this.configService.loadSchema(definition.schema).subscribe(schema => {
                this.configuration = this.configService.getMetadataConfiguration(
                    this.filter,
                    definition,
                    schema
                );
            });
        }
    }
}
