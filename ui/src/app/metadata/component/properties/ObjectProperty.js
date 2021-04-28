import React from 'react';

import { PrimitiveProperty } from './PrimitiveProperty';
import { ArrayProperty } from './ArrayProperty';
import Translate from '../../../i18n/components/translate';

export function ObjectProperty ({ property, columns, onPreview }) {
    const getProperty = (prop, idx) => {
        switch(prop.type) {
            case 'array':
                return <ArrayProperty key={ `p-${idx}` } property={prop} columns={columns} />
            case 'object':
                return <React.Fragment key={`p-${idx}`}>
                    {prop.name && <h5 className="border-bottom py-2 mb-0 mt-3"><Translate value={ prop.name } /></h5>}
                    <ObjectProperty property={prop} columns={columns} onPreview={ onPreview } />
                </React.Fragment>
            default:
                return <PrimitiveProperty key={ `p-${idx}`} property={ prop } columns={columns} />
        }
    }

    return (
        <div>
            {property && property.properties.map((prop, pIdx) => getProperty(prop, pIdx))}
        </div>
    );
}

/*
<array-property *ngSwitchCase="'array'" [property]="prop" [columns]="columns"></array-property>
<ng-container *ngSwitchCase="'object'">
    <ng-container *ngIf="!prop.widget || !prop.widget.id || prop.widget.id !=='filter-target'">
        <h5 className="border-bottom py-2 mb-0 mt-3" *ngIf="prop.name">{{ prop.name | translate }}</h5>
        <object-property [property]="prop" [columns]="columns"></object-property>
    </ng-container>

</ng-container>
<primitive-property *ngSwitchDefault [property]="prop" [columns]="columns"></primitive-property>

<filter-target-property *ngIf="prop.widget && prop.widget.id && prop.widget.id ==='filter-target'"
    [property]="prop"
    [parent]="property"
    [columns]="columns"
    (preview)="preview.emit($event)">
</filter-target-property>*/