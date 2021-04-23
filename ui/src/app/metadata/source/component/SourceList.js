import React from 'react';
import Translate from '../../../i18n/components/translate';

export default function SourceList({ entities }) {



    return (
        <div className="table-responsive mt-3">
            <table className="table table-striped w-100 table-hover">
                <thead>
                    <tr>
                        <th><Translate value="label.title">Title</Translate></th>
                        <th className="w-40"><Translate value="label.entity-id">Entity ID</Translate></th>
                        <th className="w-15"><Translate value="label.author">Author</Translate></th>
                        <th className="w-15"><Translate value="label.creation-date">Created Date</Translate></th>
                        <th className="text-center w-15"><Translate value="label.enabled">Enabled</Translate></th>
                        <th className=""></th>
                    </tr>
                </thead>
                <tbody></tbody>
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
                        <span className="badge badge-warning" tabindex="0" aria-label="Warning Badge: Incomplete Form">
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
                        <span tabindex="0"
                            [attr.aria-label]="(resolver.enabled ? 'value.enabled' : 'value.disabled') | translate"
                            className="badge"
                            *ngIf="!resolver.isDraft()"
                            [class.badge-danger]="!resolver.enabled"
                            [class.badge-success]="resolver.enabled">
                            {{ (resolver.enabled ? 'value.enabled' : 'value.disabled') | translate }}
                        </span>
                    </ng-container>
                </td>
                <td className="text-right" [ngbPopover]="resolver.enabled ? 'A metadata source must be disabled before it can be deleted.' : null"
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