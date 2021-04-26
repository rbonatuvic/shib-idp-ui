import React from 'react';

export function ArrayValue () {
    return (<></>);
}

/*
<div className="d-flex align-items-start border-bottom border-light" [ngClass]="{'bg-diff': property.differences}" tabindex="0">
        <span className="sr-only" *ngIf="property.differences">Changed:</span>
        <span className="p-2" role="term" [ngStyle]="{'width': width}"><Translate [key]="property.name">{{ property.name }}</Translate></span>
        <ng-container *ngFor="let v of property.value">
            <p [ngStyle]="{'width': width}" className="text-secondary m-0" *ngIf="!v || !v.length">-</p>
            <ul [ngStyle]="{'width': width}"
                className="list-unstyled py-2 m-0"
                [ngbPopover]="popContent"
                triggers="mouseenter:mouseleave"
                popoverClass="popover-lg popover-info"
                *ngIf="v && v.length > 0">
                <li *ngFor="let item of v; odd as isOdd; last as isLast"
                    className="text-truncate border-bottom border-light"
                    [ngClass]="{'py-2': v.length > 1, 'border-0': isLast}">
                    <ng-container *ngIf="preview.observers.length > 0 && isUrl(item)">
                        <button className="btn btn-link" (click)="preview.emit(item)">
                            <i className="fa fa-eye fa-lg text-success"></i>
                        </button>&nbsp;
                    </ng-container>
                    {{ item }}
                </li>
            </ul>
            <ng-template #popContent>
                <ul className="list-unstyled">
                    <li *ngFor="let item of v;" className="p-2 border-bottom border-light">
                        {{ item }}
                    </li>
                </ul>
            </ng-template>
        </ng-container>
    </div>*/