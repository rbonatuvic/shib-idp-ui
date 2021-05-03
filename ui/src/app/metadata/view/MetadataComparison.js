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
import { MetadataFilterVersionList } from '../domain/filter/component/MetadataFilterVersionList';
import { MetadataFilterVersionContext } from '../domain/filter/component/MetadataFilterVersionContext';

export function MetadataComparison () {

    const { type, id } = useParams();

    const [versions] = useQueryParam('versions', withDefault(ArrayParam, []));
    const schema = React.useContext(MetadataSchemaContext);
    const definition = React.useContext(MetadataDefinitionContext);

    const [limited, setLimited] = React.useState(false);

    const toggleLimited = useTranslation('action.view-only-changes');

    return (
        <>
        <h2 class="mb-4">
            Compare&nbsp;
            <Translate value={type === 'resolver' ? 'label.source' : 'label.provider'}>Source</Translate>
            &nbsp;Configuration
        </h2>
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

                                {type === 'provider' && v &&
                                <React.Fragment>
                                    <div className="numbered-header d-flex justify-content-start bg-light align-items-center py-1">
                                        <h2 className="title h4 m-0 flex-grow-1">
                                            <span className="text ml-2"><Translate value="label.metadata-filter">Metadata Filter</Translate></span>
                                        </h2>
                                    </div>
                                    <MetadataFilterVersionContext models={v} dates={config.dates}>
                                        {(c) => <MetadataFilterVersionList configuration={c} columns={ c.dates.length } limited={limited}/>}
                                    </MetadataFilterVersionContext>
                                </React.Fragment>
                                }
                            </div>
                        }
                </Configuration>
            }
        </MetadataVersionLoader>
        }
        </>
    );
}

