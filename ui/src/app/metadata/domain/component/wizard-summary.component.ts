import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';

import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider, MetadataResolver } from '../../domain/model';
import { Property } from '../model/property';
import { getSplitSchema } from '../../../wizard/reducer';

interface Section {
    id: string;
    index: number;
    label: string;
    properties: Property[];
}

export function getDefinition(path: string, definitions): any {
    let def = path.split('/').pop();
    return definitions[def];
}

export function getPropertyItemSchema(items: any, definitions: any): any {
    if (!items) { return null; }
    return items.$ref ? getDefinition(items.$ref, definitions) : items;
}

export function getStepProperty(property, model, definitions): Property {
    property = property.$ref ? getDefinition(property.$ref, definitions) : property;
    return {
        name: property.title,
        value: model,
        type: property.type,
        items: getPropertyItemSchema(property.items, definitions),
        properties: getStepProperties(
            property,
            model,
            definitions
        )
    };
}


export function getStepProperties(schema: any, model: any, definitions: any = {}): Property[] {
    if (!schema || !schema.properties) { return []; }
    return Object
        .keys(schema.properties)
        .map(property => {
            return getStepProperty(
                schema.properties[property],
                model[property],
                definitions
            );
        });
}

@Component({
    selector: 'wizard-summary',
    templateUrl: './wizard-summary.component.html',
    styleUrls: []
})

export class WizardSummaryComponent implements OnChanges {
    @Input() summary: { definition: Wizard<MetadataProvider | MetadataResolver>, schema: { [id: string]: any }, model: any };

    @Output() onPageSelect: EventEmitter<string> = new EventEmitter();

    sections: Section[];
    columns: Array<Section>[];
    steps: WizardStep[];

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.summary && this.summary) {
            const schemas = this.summary.schema;
            const model = this.summary.model;
            const def = this.summary.definition;
            const steps = def.steps;

            this.sections = steps
                .filter(step => step.id !== 'summary')
                .map(
                    (step: WizardStep) => {
                        return ({
                            id: step.id,
                            index: step.index,
                            label: step.label,
                            properties: getStepProperties(
                                schemas[step.id] || getSplitSchema(schemas['summary'], step),
                                def.formatter(model),
                                schemas.definitions || schemas.hasOwnProperty('summary') ? schemas['summary'].definitions : {}
                            )
                        });
                    }
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

