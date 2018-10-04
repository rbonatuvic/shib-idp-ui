import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromProvider from '../reducer';
import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { Property } from '../model/property';

interface Section {
    id: string;
    index: number;
    label: string;
    properties: Property[];
}

export function getStepProperties(schema: any, model: any): Property[] {
    if (!schema || !schema.properties) { return []; }
    return Object.keys(schema.properties).map(property => ({
        name: schema.properties[property].title,
        value: (model && model.hasOwnProperty(property)) ? model[property] : null,
        type: schema.properties[property].type,
        properties: schema.properties ? getStepProperties(
            schema.properties[property],
            (model && model.hasOwnProperty(property)) ? model[property] : null
        ) : []
    }));
}

@Component({
    selector: 'provider-wizard-summary',
    templateUrl: './provider-wizard-summary.component.html',
    styleUrls: []
})

export class ProviderWizardSummaryComponent implements OnChanges {
    @Input() summary: { definition: Wizard<MetadataProvider>, schema: { [id: string]: any }, model: any };

    @Output() onPageSelect: EventEmitter<string> = new EventEmitter();

    sections: Section[];
    columns: Array<Section>[];

    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.summary && this.summary) {
            const schemas = this.summary.schema;
            const model = this.summary.model;
            const def = this.summary.definition;
            const steps = def.steps;

            this.sections = steps
                .filter(step => step.id !== 'summary')
                .map(
                    (step: WizardStep) => ({
                        id: step.id,
                        index: step.index,
                        label: step.label,
                        properties: getStepProperties(schemas[step.id], def.formatter(model))
                    })
                );

            this.columns = this.sections.reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / Math.round(this.sections.length / 2));

                if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [];
                }

                resultArray[chunkIndex].push(item);

                return resultArray;
            }, []);
        }
    }

    gotoPage(page: string = ''): void {
        this.onPageSelect.emit(page);
    }
}

