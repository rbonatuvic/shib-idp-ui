import React from 'react';
import FormattedDate from '../../core/components/FormattedDate';
import Translate from '../../i18n/components/translate';
import { MetadataSection } from './MetadataSection';
import { usePropertyWidth } from './properties/hooks';

import { ObjectProperty } from './properties/ObjectProperty';

export function MetadataConfiguration ({ configuration }) {

    const onEdit = (value) => console.log(value);

    const columns = configuration.dates?.length || 1;
    const width = usePropertyWidth(columns);

    return (
        <>
            { configuration && configuration.sections.map((section, sidx) =>
                <MetadataSection section={section} key={sidx} index={ sidx } onEdit={onEdit}>
                    <div className="d-flex border-bottom border-light border-2 py-2">
                        <strong style={ {width} }><Translate value="label.option">Option</Translate></strong>
                        {configuration.dates.map((d, didx) => 
                        <strong style={ { width } } key={didx}>
                            {configuration.dates.length <= 1 ?
                                <Translate value="label.value">Value</Translate>
                                :
                                <FormattedDate date={d} />
                            }
                        </strong>
                        )}
                    </div>
                    <ObjectProperty property={section} columns={columns}></ObjectProperty>
                </MetadataSection>
            ) }
        </>
    );
}

/*<ng-container *ngFor="let section of configuration.sections; let i = index;">
        <section class="mb-4 config-section-list-item" *ngIf="section && section.properties && section.properties.length">
            <div class="config-group">
                <div class="numbered-header d-flex justify-content-start bg-light align-items-center">
                    <h2 class="title h4 m-0 flex-grow-1">
                        <span *ngIf="numbered"
                            class="d-inline-block px-2 py-1 mb-0 h4 number border border-secondary bg-white rounded-lg">
                            <span *ngIf="i + 1 < 10">0</span>{{ i + 1 }}
                        </span>
                        <span class="text ml-2">{{ section.label | translate }}</span>
                    </h2>
                    <div class="actions px-2" *ngIf="editable">
                        <button class="btn btn-link edit-link change-view" (click)="edit(section.id)">
                            <i class="fa fa-edit"></i>&nbsp;
                            <translate-i18n key="action.edit">Edit</translate-i18n>
                        </button>
                    </div>
                </div>
                <div class="p-2">
                    <ng-container *ngIf="section && section.properties && section.properties.length">
                        <div class="d-flex border-bottom border-light border-2 py-2">
                            <strong [ngStyle]="{'width': width}"><translate-i18n key="label.option">Option</translate-i18n></strong>
                            <strong *ngFor="let date of configuration.dates" [ngStyle]="{'width': width}">
                                <translate-i18n key="label.value" *ngIf="configuration.dates.length <= 1">Value</translate-i18n>
                                <span *ngIf="configuration.dates.length > 1">{{ date | date:DATE_FORMAT }}</span>
                            </strong>
                        </div>
                        
                    </ng-container>
                </div>
            </div>
        </section>*/