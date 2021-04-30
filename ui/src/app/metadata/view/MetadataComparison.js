import React from 'react';
import {
    useQueryParam,
    ArrayParam,
    withDefault
} from 'use-query-params';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';
import { MetadataVersionLoader } from '../hoc/MetadataVersionLoader';
import { Configuration } from '../hoc/Configuration';
import { MetadataConfiguration } from '../component/MetadataConfiguration';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import Translate from '../../i18n/components/translate';
import { CustomInput } from 'reactstrap';
import { useTranslation } from '../../i18n/hooks';

export function MetadataComparison () {

    const { type, id } = useParams();

    const [versions] = useQueryParam('versions', withDefault(ArrayParam, []));
    const schema = React.useContext(MetadataSchemaContext);
    const definition = React.useContext(MetadataDefinitionContext);

    const [limited, setLimited] = React.useState(false);

    const toggleLimited = useTranslation('action.view-only-changes');

    return (
        <>
        {versions &&
        <MetadataVersionLoader versions={versions}>
            {(v) =>
                <Configuration entities={v} schema={schema} definition={definition} limited={limited}>
                        {(config) => 
                            <div className={config.dates.length > 2 ? 'container-fluid' : 'container'}>
                                <div className="px-3 my-3 d-flex justify-content-between align-items-center" id="navigation">
                                    <div>
                                        <Link className="btn btn-link" to={`/metadata/${type}/${id}/configuration/history`}>
                                            <FontAwesomeIcon icon={faHistory} />&nbsp;
                                            <Translate value="action.version-history">Version History</Translate>
                                        </Link>
                                    </div>
                                    <CustomInput type="switch"
                                        id="toggleLimited"
                                        name="toggleLimited"
                                        label={toggleLimited}
                                        value={limited}
                                        onChange={ () => setLimited(!limited) } />
                                </div>
                                <MetadataConfiguration configuration={config} />
                            </div>
                        }
                </Configuration>
            }
        </MetadataVersionLoader>
        }
        </>
    );
}

/*

<h2 class="mb-4" [ngSwitch]="type$ | async">
    Compare
    <ng-container *ngSwitchCase="'resolver'"><translate-i18n key="label.source">Source</translate-i18n></ng-container>
    <ng-container *ngSwitchDefault><translate-i18n key="label.provider">Provider</translate-i18n></ng-container>
    Configuration
</h2>
<div *ngIf="!(loading$ | async)" class="" [ngClass]="{
    'container-fluid': (numVersions$ | async) > 2,
    'container': (numVersions$ | async) <= 2
}">
    <div class="px-3 my-3 d-flex justify-content-between">
        <a class="btn btn-link" routerLink="../history">
            <i class="fa fa-history sr-hidden"></i>&nbsp;
            <translate-i18n key="action.version-history">Version History</translate-i18n>
        </a>
        <button class="btn btn-link" (click)="limiter.next('compare')">
            <translate-i18n key="action.view-only-changes">Compare Changes</translate-i18n>&nbsp;
            <i class="fa fa-lg sr-hidden"
                [ngClass]="{
                    'fa-toggle-off': limited$ | async,
                    'fa-toggle-on': !(limited$ | async)
                }"></i>
        </button>
    </div>
    <metadata-configuration
        [configuration]="versions$ | async"></metadata-configuration>
    <ng-container *ngIf="isProvider$ | async">
        <div class="numbered-header d-flex justify-content-start bg-light align-items-center py-1">
            <h2 class="title h4 m-0 flex-grow-1">
                <span class="text ml-2"><translate-i18n key="label.metadata-filter">Metadata Filter</translate-i18n></span>
            </h2>
        </div>
        <ng-container *ngIf="!(filterCompare$ | async)">
            <filter-version-list
                class="d-block p-2"
                [filters]="filters$ | async"
                (compare)="compareFilters($event)">
            </filter-version-list>
        </ng-container>
        <ng-container *ngIf="(filterCompare$ | async)">
            <br />
            <metadata-configuration [configuration]="filterCompare$ | async"></metadata-configuration>
            <div class="d-flex justify-content-end my-2">
                <button class="btn btn-success" (click)="resetCompareFilters()">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;
                    <translate-i18n key="label.filter-versions">Filter Versions</translate-i18n>
                </button>
            </div>
        </ng-container>
    </ng-container>
</div>
<div *ngIf="loading$ | async" class="d-flex justify-content-center">
    <i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
    <span class="sr-only">Loading...</span>
</div>

*/