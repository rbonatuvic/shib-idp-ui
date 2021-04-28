import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

import { Translate } from '../../../../i18n/components/translate';

export function MetadataFilterConfigurationListItem ({ filter, isLast, isFirst, onOrderUp, onOrderDown, editable, onRemove, index }) {
    const [open, setOpen] = React.useState(false);
    
    return (<>
        <div className="d-flex justify-content-start align-items-center">
            <span className="mr-2">{ index + 1 }</span>
            {editable &&
            <div className="d-flex justify-content-between">
                <button className="btn btn-link btn-sm" onClick={() => onOrderUp(filter.resourceId)} disabled={isFirst}>
                    <FontAwesomeIcon icon={faArrowCircleUp} size='lg' />
                    <span className="sr-only"><Translate value="action.move-up">Move Up</Translate></span>
                </button>
                <button className="btn btn-link btn-sm" onClick={() => onOrderDown(filter.resourceId)} disabled={isLast}>
                    <FontAwesomeIcon icon={faArrowCircleDown} size='lg' />
                    <span className="sr-only"><Translate value="action.move-up">Move Down</Translate></span>
                </button>
            </div>
            }
            <button className="btn btn-link mx-4" onClick={ () => setOpen(!open) }>{ filter.name }</button>
            <span className="">{ filter['@type'] }</span>
            <span className="ml-4">
                <span className="badge badge-primary">
                    <Translate value={filter.filterEnabled ? 'label.enabled' : 'label.disabled'} />
                </span>
            </span>
        </div>
        
    </>);
}

/*

<div *ngIf="open">
    <hr className="my-2" />
    <div className="d-flex justify-content-end mb-2" *ngIf="editable">
        <div className="d-flex justify-content-between">
            <a className="btn btn-link"
                [routerLink]="['../../', 'filter', filter.resourceId, 'edit']">
                <i className="fa fa-edit sr-hidden"></i>&nbsp;
                <Translate value="action.edit">Edit</Translate>
            </a>
            <button className="btn btn-link"
                (click)="onRemove.emit(filter.resourceId)">
                <i className="fa fa-trash sr-hidden"></i>&nbsp;
                <Translate value="action.delete">Delete</Translate>
            </button>
        </div>
    </div>
    <metadata-configuration
        [numbered]="false"
        [configuration]="configuration"
        [entity]="filter"
        [definition]="definition"
        (preview)="onPreview($event)"></metadata-configuration>
    <button className="btn btn-link btn-sm" (click)="open = !open">
        <i className="fa fa-chevron-up sr-hidden"></i>&nbsp;
        <Translate value="action.close">Close</Translate>
    </button>
</div>
*/