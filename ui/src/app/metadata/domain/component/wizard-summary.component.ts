import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import merge from 'deepmerge';

import { Wizard, WizardStep } from '../../../wizard/model';
import { MetadataProvider, MetadataResolver } from '../../domain/model';
import { Property } from '../model/property';
import { getSplitSchema } from '../../../wizard/reducer';
import { getStepProperties } from '../utility/configuration';

interface Section {
    id: string;
    index: number;
    label: string;
    pageNumber: number;
    properties: Property[];
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
            const schema = this.summary.schema;
            const model = this.summary.model;
            const def = this.summary.definition;
            const steps = def.steps;

            this.sections = steps
                .filter(step => step.id !== 'summary')
                .map(
                    (step: WizardStep, num: number) => {
                        const { id, index, label } = step;
                        const split = getSplitSchema(schema, step);
                        const properties = getStepProperties(
                            split,
                            def.formatter(model),
                            schema.definitions || {}
                        );
                        return ({
                            id,
                            pageNumber: num + 1,
                            index,
                            label,
                            properties
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

