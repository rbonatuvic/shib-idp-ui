import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Translate from '../../../i18n/components/translate';
import { usePropertyWidth } from './hooks';
import { PropertyValue } from './PropertyValue';



const isUri = (value) => {
    try {
        new URL(value);
    } catch (err) {
        return false;
    }
    return true;
}

const getItemType = (property) => {
    const items = property.items;
    const def = 'default';
    return items ? items.widget ? items.widget.id : def : def;
}

const isUrl = (str) => {
    return isUri(str);
}

export function ArrayProperty ({ property, columns, index, onPreview }) {

    const keys = property.value.reduce((val, version) => version ? version.length > val ? version.length : val : val, 0);
    const range = [...Array(keys).keys()];

    const dataList = property.widget?.data;

    const width = usePropertyWidth(columns);

    const type = getItemType(property);

    return (
        <>
            {property.items.type === 'object' &&
                <div className={ property.differences ? 'bg-diff' : '' }>
                    <div className="p-2" role="term"><Translate value={property.name}>{ property.name }</Translate></div>
                    {range.map((i) =>
                        <div key={i} className={`py-2 border-top ${property.differences ? 'bg-diff' : ''}`}>
                            {Object.keys(property.items.properties).map((prop, n) =>
                                <div className="d-flex py-2" tabIndex="0" key={`${i}-${n}`}>
                                    {property.differences && <span className="sr-only">Changed:</span> }
                                    {property.items.properties &&
                                        <div style={{ width }} className="pl-4">
                                            <Translate value={property.items.properties[prop].title}>{property.items.properties[prop].title}</Translate>
                                        </div>
                                    }
                                    { property.value.map((version, vIdx) => 
                                        <React.Fragment key={vIdx}>
                                            {version && version[vIdx] &&
                                                <PropertyValue name={property.name} columns={columns} value={version[i][prop]} />
                                            }
                                            {(!version || !version[vIdx]) && <div style={{ width }}>
                                                -
                                            </div>
                                            }
                                        </React.Fragment>
                                    )}
                                </div>
                            )}
                            
                        </div>
                    )}
                </div>
            }
            {property.items.type === 'string' &&
                <>
                    { (type  === 'datalist' || type === 'select' || !property.width || !property.widget.id) ?
                        <div className={`d-flex align-items-start border-bottom border-light ${ property.differences ? 'bg-diff' : '' }`}
                            tabIndex="0">
                            {property.differences && <span className="sr-only">Changed:</span> }
                            <span className="p-2" role="term" style={ {width} } ><Translate value={property.name}>{ property.name }</Translate></span>
                            {property.value.map((v, vidx) => 
                                <React.Fragment key={vidx}>
                                    {(!v || !v.length) && <p style={ {width} } className="text-secondary m-0">-</p> }
                                    {(v && v.length > 0) &&
                                        <ul style={ {width} } className="list-unstyled py-2 m-0">
                                            {v.map((item, idx) => 
                                                <li key={idx} className={`text-truncate border-bottom border-light ${v.length > 1 ? 'py-2' : ''} ${'border-0'}`}>
                                                    {onPreview && isUrl(item) &&
                                                        <>
                                                        <button className="btn btn-link" onClick={() => onPreview(item)}>
                                                            <FontAwesomeIcon icon={faEye} size="lg" className="text-success" />
                                                        </button>&nbsp;
                                                        </>
                                                    }
                                                    <PropertyValue value={item} name={property.name} />
                                                </li>
                                            )}
                                        </ul>
                                    }
                                </React.Fragment>
                            )}
                        </div>
                    : property.widget && property.widget.data ?
                        <>
                            {dataList.map((item, itemIdx) => 
                                <div className={`d-flex justify-content-start border-bottom border-light ${ property.differences && item.differences ? 'bg-diff' : '' }`} tabIndex="0" key={itemIdx}>
                                    {item.differences && <span className="sr-only">Changed:</span> }
                                    <span className="p-2" role="term" style={ {width} }><Translate value={item.label}>{ item.label }</Translate></span>
                                    { property.value.map((v, vIdx) =>
                                    <div className="py-2" style={ {width} }>
                                        {v && v.indexOf(item.key) > -1 && <span><Translate value="value.true">true</Translate></span> }
                                        {(!v || !(v.indexOf(item.key) > -1)) && <span><Translate value="value.false">false</Translate></span> }
                                    </div>
                                    )}
                                </div>
                            )}
                        </>
                    : ''}
                </>
            }
        </>
    );
}

/*
<ng-container *ngIf="" [ngSwitch]="getItemType(property)">
    <ng-container *ngSwitchCase="'datalist'">
        <ng-template [ngTemplateOutlet]="listref"></ng-template>
    </ng-container>
    <ng-container *ngSwitchCase="'select'">
        <ng-template [ngTemplateOutlet]="listref"></ng-template>
    </ng-container>
    <ng-container *ngSwitchDefault>
        <div *ngIf="!property.widget || !property.widget.id">
            <ng-template [ngTemplateOutlet]="listref"></ng-template>
        </div>
        <div *ngIf="property.widget && property.widget.data">
            
        </div>
    </ng-container>
</ng-container>
<ng-template #listref>
    [ngbPopover]="popContent"
                                        triggers="mouseenter:mouseleave"
                                        popoverClass="popover-lg popover-info"


                                        <ng-template #popContent>
                                        <ul className="list-unstyled">
                                            <li *ngFor="let item of v;" className="p-2 border-bottom border-light">
                                                {{ item }}
                                            </li>
                                        </ul>
                                    </ng-template>
</ng-template>

*/