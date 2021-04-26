import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, UncontrolledPopover, PopoverBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';

export default function SourceList({ entities, onDelete }) {

    const [modal, setModal] = React.useState(false);

    const toggle = () => setModal(!modal);

    const [deleting, setDeleting] = React.useState(null);



    const deleteSource = (id) => {
        onDelete(deleting);
        setDeleting(null);
    }

    return (
        <div className="table-responsive mt-3 source-list!">
            <table className="table table-striped w-100 table-hover">
                <thead>
                    <tr>
                        <th><Translate value="label.title">Title</Translate></th>
                        <th className="w-40"><Translate value="label.entity-id">Entity ID</Translate></th>
                        <th className="w-15"><Translate value="label.author">Author</Translate></th>
                        <th className="w-15"><Translate value="label.creation-date">Created Date</Translate></th>
                        <th className="text-center w-15"><Translate value="label.enabled">Enabled</Translate></th>
                        <th className="w-auto"></th>
                    </tr>
                </thead>
                <tbody>
                    {entities.map((source, idx) =>
                        <tr key={ idx }>
                            <td>
                                <Link to={`/metadata/source/${source.id}/configuration/options`}>{source.serviceProviderName }</Link>
                            </td>
                            <td>
                                {source.entityId}
                            </td>
                            <td>
                                {source.createdBy }
                            </td>
                            <td><FormattedDate date={source.createdDate } /></td>
                            <td className="text-center">
                                <Badge color={source.serviceEnabled ? 'success' : 'danger' }>
                                    <Translate value={source.serviceEnabled ? 'value.enabled' : 'value.disabled'}></Translate>
                                </Badge>
                            </td>
                            <td className="text-right" id={`delete-source-btn-${idx}`}>
                                <button className="btn btn-outline btn-sm btn-danger"
                                    type="button"
                                    disabled={ source.serviceEnabled }
                                    onClick={() => setDeleting(source.id) }>
                                    <span className="sr-only">Delete</span>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                { source.serviceEnabled && 
                                <UncontrolledPopover trigger="hover" placement="left" target={`delete-source-btn-${idx}`}>
                                    <PopoverBody>A metadata source must be disabled before it can be deleted.</PopoverBody>
                                </UncontrolledPopover>
                                }
                            </td>
                        </tr>
                    ) }
                </tbody>
            </table>
            <Modal isOpen={!!deleting} toggle={() => setDeleting(null)}>
                <ModalHeader toggle={toggle}><Translate value="message.delete-source-title">Delete Metadata Source?</Translate></ModalHeader>
                <ModalBody className="d-flex align-content-center">
                    <FontAwesomeIcon className="text-danger mr-4" size="4x" icon={ faExclamationTriangle } />
                    <p className="text-danger font-weight-bold mb-0">
                        <Translate value="message.delete-source-body">You are deleting a metadata source. This cannot be undone. Continue?</Translate>
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => deleteSource(deleting)}>
                        <Translate value="action.delete">Delete</Translate>
                    </Button>{' '}
                    <Button color="secondary" onClick={() => setDeleting(null)}>
                        <Translate value="action.cancel">Cancel</Translate>
                    </Button>
                </ModalFooter>
            </Modal>
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