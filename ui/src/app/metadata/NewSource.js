import React from 'react';
import { NavLink, Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Translate from '../i18n/components/translate';
import { MetadataSchema } from './hoc/MetadataSchema';
import { MetadataWizard } from './view/MetadataWizard';
import { MetadataCopy } from './view/MetadataCopy';
import { MetadataUpload } from './view/MetadataUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faLink, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

export function NewSource() {

    const { path } = useRouteMatch();

    const [showNav, setShowNav] = React.useState(true);

    return (
        <div className="container-fluid p-3">
            <section className="section" aria-label="Add a new metadata source - how are you adding the metadata information?" tabIndex="0">
                <div className="section-header bg-info p-2 text-white">
                    <div className="row justify-content-between">
                        <div className="col-md-12">
                            <span className="display-6"><Translate value="label.add-a-new-metadata-resolver">Add a new metadata source</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    {showNav && <>
                        <h3><Translate value="label.how-are-you-adding-the-metadata-information">How are you adding the metadata information?</Translate></h3>
                        <br />
                        <div className="row">
                            <div className="col col-xl-6 col-lg-9 col-xs-12">
                                <div className="d-flex justify-content-between">
                                    <div className="resolver-nav-option">
                                        <NavLink type="button"
                                            to="upload"
                                            className="btn btn-lg btn-block btn-secondary d-flex flex-column justify-content-center align-items-center"
                                            aria-label="Upload local metadata file or use a metadata URL"
                                            role="button"
                                            activeClassName='btn-success'>
                                            <Translate value="label.upload-url">Upload/URL</Translate>
                                            <FontAwesomeIcon icon={faLink} size="2x" />
                                        </NavLink>
                                    </div>
                                    <div className="">
                                        <span className="subheading-1">&nbsp;<Translate value="label.or">or</Translate>&nbsp;</span>
                                    </div>
                                    <div className="resolver-nav-option">
                                        <NavLink type="button"
                                            className="btn btn-lg btn-block btn-secondary d-flex flex-column justify-content-center align-items-center"
                                            aria-label="Create metadata source using the wizard"
                                            role="button"
                                            to="blank"
                                            activeClassName='btn-info'>
                                            <Translate value="action.create">Create</Translate>
                                            <FontAwesomeIcon icon={faPlusSquare} size="2x" />
                                        </NavLink>
                                    </div>
                                    <div className="">
                                        <span className="subheading-1">&nbsp;<Translate value="label.or">or</Translate>&nbsp;</span>
                                    </div>
                                    <div className="resolver-nav-option">
                                        <NavLink type="button"
                                            className="btn btn-lg btn-block btn-secondary d-flex flex-column justify-content-center align-items-center"
                                            aria-label="Copy a metadata source"
                                            role="button"
                                            to="copy"
                                            activeClassName='btn-warning'>
                                            <Translate value="action.copy">Copy</Translate>
                                            <FontAwesomeIcon icon={faCopy} size="2x"/>
                                        </NavLink>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </>}
                    <MetadataSchema type={'source'} wizard={true}>
                        <Switch>
                            <Route path={`${path}/blank`} render={() =>
                                <MetadataWizard type="source" onShowNav={(s) => { setShowNav(s) }} />
                            } />
                            <Route path={`${path}/upload`} render={() =>
                                <MetadataUpload />
                            } />
                            <Route path={`${path}/copy`} render={() =>
                                <MetadataCopy onShowNav={ (s) => { setShowNav(s) } } />
                            } />
                            <Redirect exact path={`${path}`} to={`${path}/blank`} />
                        </Switch>
                    </MetadataSchema>
                </div>
            </section>
        </div>
    );
}