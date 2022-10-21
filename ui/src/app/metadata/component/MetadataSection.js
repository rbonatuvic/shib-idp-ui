import React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import Translate from '../../i18n/components/translate';

export function MetadataSection ({ section, index = -1, onEdit, children }) {
    return (
        <>
            <section className="mb-4 config-section-list-item">
                <div className="config-group">
                    <div className="numbered-header d-flex justify-content-start bg-light align-items-center">
                        <h2 className="title h4 m-0 flex-grow-1">
                            {index > -1 &&
                            <span className="d-inline-block px-2 py-1 mb-0 h4 number border border-secondary bg-white rounded-lg">
                                {index < 10 && <span>0</span>}
                                { index + 1 }
                            </span>
                            }
                            
                            <span className="text ms-2">
                                <Translate value={ section.label } />
                            </span>
                        </h2>
                        {onEdit &&
                        <div className="actions px-2">
                            <Button variant="link" className="edit-link change-view" onClick={()=>onEdit(section.id)}>
                                <FontAwesomeIcon icon={faEdit} />&nbsp;
                                <Translate value="action.edit">Edit</Translate>
                            </Button>
                        </div>
                        }
                    </div>
                    {section && section.properties && section.properties.length &&
                    <div className="p-2">
                        { children }
                    </div>
                    }
                </div>
            </section>
        </>
    );
}