import React from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner, faSave, faArrowCircleRight, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

import {Translate} from '../../i18n/components/translate';
import {
    useCurrentPage,
    useLastPage,
    useNextPage,
    usePreviousPage,
    setWizardIndexAction,
    useWizardDispatcher
} from './Wizard';

export const ICONS = {
    CHECK: 'CHECK',
    INDEX: 'INDEX'
}

export function WizardNav ({ disabled = false, onSave, saving }) {

    const dispatch = useWizardDispatcher();

    const current = useCurrentPage();
    const previous = usePreviousPage();
    const next = useNextPage();
    const last = useLastPage();

    const onSetIndex = idx => {
        dispatch(setWizardIndexAction(idx));
    };

    const currentIcon = (last && current.index === last.index) ? <FontAwesomeIcon icon={faCheck} /> : current.index;

    return (
        <nav>
            <ul className="nav nav-wizard">
                {previous && <li className="nav-item">
                    <button className="nav-link previous btn d-flex justify-content-between align-items-start" onClick={() => onSetIndex(previous.id)} disabled={disabled} aria-label={() => <Translate value={previous.path} />}
                        type="button">
                        <span className="direction d-flex flex-column align-items-center">
                            <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
                            <Translate value="action.back">Back</Translate>
                        </span>
                        <span className="label">
                            {previous.index}.&nbsp;
                            <Translate value={previous.label}>{previous.label}</Translate>
                        </span>
                    </button>
                </li>
                }
                <li className="nav-item">
                    <h3 className="tag tag-primary">
                        <span className="index">
                            {currentIcon}
                        </span>
                        {current.index}.&nbsp;<Translate value={current.label} />
                    </h3>
                </li>
                {next &&
                <li className="nav-item">
                    <button className="nav-link next btn d-flex justify-content-between align-items-start" onClick={() => onSetIndex(next.id)} disabled={disabled} aria-label={() => <Translate value={previous.path} />}
                        type="button">
                        <span className="label">
                            {next.index }.&nbsp;
                            <Translate value={next.label}>{next.label}</Translate>
                        </span>
                        <span className="direction d-flex flex-column align-items-center">
                            <FontAwesomeIcon icon={faArrowCircleRight} size="2x" />
                            <Translate value="action.next">Next</Translate>
                        </span>
                    </button>
                </li>
                }
                {last && (last.id === current.id) && 
                <li className="nav-item">
                    <button className="nav-link save btn d-flex justify-content-between align-items-start"
                        aria-label="Save"
                        disabled={disabled}
                        onClick={() => onSave()}
                        type="button">
                        <span className="label">
                            <Translate value="action.save">
                                Save
                            </Translate>
                        </span>
                        <span className="direction d-flex flex-column align-items-center">
                            <FontAwesomeIcon icon={saving ? faSpinner : faSave} pulse={saving} size="2x" className="next" />
                            <Translate value="action.save">Save</Translate>
                        </span>
                    </button>
                </li>
                }
            </ul>
        </nav>

    );
}