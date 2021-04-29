import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp, faChevronUp, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Translate } from '../../../../i18n/components/translate';
import { Link } from 'react-router-dom';
import { getDefinition } from '../../../domain/index';
import { useMetadataSchema } from '../../../hooks/api';
import { MetadataConfiguration } from '../../../component/MetadataConfiguration';
import { useMetadataConfiguration } from '../../../hooks/configuration';

export function MetadataFilterConfigurationListItem ({ filter, isLast, isFirst, onOrderUp, onOrderDown, editable, onRemove, index }) {
    const [open, setOpen] = React.useState(false);

    const definition = React.useMemo(() => getDefinition(filter['@type'], ), [filter]);

    const { get, response } = useMetadataSchema();

    const [schema, setSchema] = React.useState();

    async function loadSchema(d) {
        const source = await get(`/${d.schema}`)
        if (response.ok) {
            setSchema(source);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadSchema(definition) }, [definition]);

    const configuration = useMetadataConfiguration([filter], schema, definition);
    
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
        {open &&
        <div>
            <hr className="my-2" />
            {editable &&
            <div className="d-flex justify-content-end mb-2">
                <div className="d-flex justify-content-between">
                    <Link className="btn btn-link"
                        to={`filter/${filter.resourceId}/edit`}>
                        <FontAwesomeIcon icon={faEdit} className="sr-hidden" />&nbsp;
                        <Translate value="action.edit">Edit</Translate>
                    </Link>
                    <button className="btn btn-link"
                        onClick={() => onRemove(filter.resourceId)}>
                        <FontAwesomeIcon icon={faTrash} className="sr-hidden" />&nbsp;
                        <Translate value="action.delete">Delete</Translate>
                    </button>
                </div>
            </div>
            }
            {configuration && <MetadataConfiguration configuration={ configuration }/> }
            <button className="btn btn-link btn-sm" onClick={() => setOpen(!open)}>
                <FontAwesomeIcon icon={faChevronUp} />&nbsp;
                <Translate value="action.close">Close</Translate>
            </button>
        </div>
        }
    </>);
}