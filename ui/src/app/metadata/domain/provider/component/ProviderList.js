import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, UncontrolledPopover, PopoverBody } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';

import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';

export default function ProviderList({ entities, onDelete }) {
    return (
        <div className="table-responsive mt-3 provider-list!">
            <table className="table table-striped w-100 table-hover">
                <thead>
                    <tr>
                        <th><Translate value="label.order">Order</Translate></th>
                        <th className="w-25"><Translate value="label.title">Title</Translate></th>
                        <th className="w-15"><Translate value="label.provider-type">Provider Type</Translate></th>
                        <th className="w-15"><Translate value="label.author">Author</Translate></th>
                        <th className="w-15"><Translate value="label.creation-date">Created Date</Translate></th>
                        <th className="text-right w-15"><Translate value="label.enabled">Enabled</Translate></th>
                    </tr>
                </thead>
                <tbody>
                    {entities.map((provider, idx) =>
                        <tr key={idx}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="provider-index text-center text-primary font-weight-bold">{ idx + 1 }</div>
                                    <button className="btn btn-link px-1"
                                        aria-label="Decrease reorder by 1">
                                            <FontAwesomeIcon className="text-info" icon={faChevronCircleDown} size="lg" />
                                        <i className="fa text-info fa-lg fa-chevron-circle-down" aria-hidden="true"></i>
                                    </button>
                                    <button className="btn btn-link px-1"
                                        aria-label="Increase reorder by 1">
                                        <FontAwesomeIcon className="text-info" icon={faChevronCircleUp} size="lg" />
                                        <i className="fa text-info fa-lg fa-chevron-circle-up" aria-hidden="true"></i>
                                    </button>
                                </div>
                                { /*
                                     
                                    <div *ngIf="!(isSearching$ | async)" className="provider-index text-center text-primary font-weight-bold">{{ i + 1 }}</div>
                                    <div *ngIf="(isSearching$ | async)" className="provider-index text-center text-primary font-weight-bold">&mdash;</div>
                                    &nbsp;
                                    <button className="btn btn-link px-1"
                                        (click)="updateOrderDown(provider); $event.stopPropagation();"
                                        [disabled]="isLast || (isSearching$ | async)"
                                        aria-label="Decrease reorder by 1">
                                        <i className="fa text-info fa-lg fa-chevron-circle-down" aria-hidden="true"></i>
                                    </button>
                                    <button className="btn btn-link  px-1"
                                        (click)="updateOrderUp(provider); $event.stopPropagation();"
                                        [disabled]="isFirst || (isSearching$ | async)"
                                        aria-label="Increase reorder by 1">
                                        <i className="fa text-info fa-lg fa-chevron-circle-up" aria-hidden="true"></i>
                                    </button>
                                </div>
                                */ }
                            </td>
                            <td>
                                <Link to={`/metadata/provider/${provider.resourceId}/configuration/options`}>{provider.name}</Link>
                            </td>
                            <td>{ provider['@type'] }</td>
                            <td>{ provider.createdBy }</td>
                            <td><FormattedDate date={provider.createdDate} /></td>
                            <td className="text-right">
                                <Badge color={provider.serviceEnabled ? 'success' : 'danger'}>
                                    <Translate value={provider.serviceEnabled ? 'value.enabled' : 'value.disabled'}></Translate>
                                </Badge>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
}

/*<tbody infiniteScroll [infiniteScrollDistance]="2" [infiniteScrollThrottle]="50" (scrolled)="scroll.emit()">
            <tr *ngFor="let resolver of entities; index as i">
                <td *ngIf="!resolver.isDraft()">
                    <a [routerLink]="['/', 'metadata', 'resolver', resolver.getId(), 'configuration', 'options']">{{ resolver.name }}</a>
                </td>
                <td *ngIf="resolver.isDraft()">
                    <a [routerLink]="['/', 'metadata', 'resolver', 'new', 'blank', 'common']"
                        [queryParams]="{'id': resolver.getId()}">{{ resolver.name }}</a>
                </td>
                <td [attr.aria-label]="resolver.getDisplayId()">{{ resolver.getDisplayId() }}</td>
                <td [attr.aria-label]="resolver.createdBy">{{ resolver.createdBy ? resolver.createdBy : '&mdash;' }}</td>
                <td [attr.aria-label]="resolver.getCreationDate() ? (resolver.getCreationDate() | customDate) : 'unknown'">
                    {{ resolver.getCreationDate() ? (resolver.getCreationDate() | customDate) : '&mdash;' }}
                </td>
                <td className="text-center">
                    <span *ngIf="resolver.isDraft()">
                        <span className="badge badge-warning" tabIndex="0" aria-label="Warning Badge: Incomplete Form">
                            <Translate value="message.incomplete-form">
                            Incomplete Form
                            </Translate>
                        </span>
                    </span>
                    <ng-container *ngIf="!!toggleEnabled.observers.length">
                        <button
                            className="btn btn-success btn-sm"
                            (click)="toggleEnabled.emit(resolver); $event.stopPropagation()"
                            aria-label="Enable this service provider">
                            <Translate *ngIf="resolver.enabled" value="label.disable">Disable</Translate>
                            <Translate *ngIf="!resolver.enabled" value="label.enable">Enable</Translate>
                            <i className="fa fa-fw fa-check fa-lg" *ngIf="!resolver.enabled"></i>
                        </button>
                    </ng-container>
                    <ng-container *ngIf="!toggleEnabled.observers.length">
                        <span tabIndex="0"
                            [attr.aria-label]="(resolver.enabled ? 'value.enabled' : 'value.disabled') | translate"
                            className="badge"
                            *ngIf="!resolver.isDraft()"
                            [class.badge-danger]="!resolver.enabled"
                            [class.badge-success]="resolver.enabled">
                            {{ (resolver.enabled ? 'value.enabled' : 'value.disabled') | translate }}
                        </span>
                    </ng-container>
                </td>
                <td className="text-right" [ngbPopover]="resolver.enabled ? 'A metadata provider must be disabled before it can be deleted.' : null"
                    [openDelay]="300" triggers="mouseenter:mouseleave" placement="left">
                    <button className="btn btn-outline btn-sm btn-danger" (click)="delete.emit({
                        entity: resolver,
                        draft: resolver.isDraft()
                    })"
                    [disabled]="resolver.enabled">
                        <span className="sr-only">Delete</span>
                        <i className="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        </tbody>*/