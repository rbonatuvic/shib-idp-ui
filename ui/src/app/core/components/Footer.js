import React from 'react';

import Translate from '../../i18n/components/translate';
import {useTranslation} from '../../i18n/hooks';

import { brand } from '../../app.brand';
import VersionInfo from './VersionInfo';

function FooterLink ({ link }) {
    const description = useTranslation(link?.description || '');
    const label = useTranslation(link?.label || '');
    return (
        <a href={link.url} target="_blank" aria-label={description} title={description} rel="noreferrer">
            {label}
        </a>
    );
}

export function Footer () {
    return (
        <footer>
            <div className="row">
                <div className="col-md-6 copyright">
                    <div className="d-flex flex-column align-items-start justify-content-between p-2">
                        <ul className="list-inline">
                            <li className="list-inline-item"><Translate value="brand.footer.text"></Translate></li>
                            { brand.footer.links.map((link, idx) => 
                            <li className="list-inline-item" key={idx}>
                                <FooterLink link={ link }></FooterLink>
                            </li>
                            ) }
                        </ul>
                        <VersionInfo />
                    </div>
                </div>
                <div className="col-md-6 logo">
                    <div className="d-flex align-items-end justify-content-end p-2">
                        <span className="flex-item me-2"><Translate value="brand.in-partnership-with">In partnership with</Translate></span>&nbsp;
                        <a href="https://www.unicon.net" target="_blank" title="Unicon" className="flex-item" rel="noreferrer">
                            <img src="assets/logo_unicon.png" className="img-fluid float-right" alt="Unicon Logo" />
                        </a>
                        &nbsp;<span className="flex-item mx-2"><Translate value="brand.and">and</Translate></span>&nbsp;
                        <a href="https://www.internet2.edu/" target="_blank" title="Internet 2" className="flex-item" rel="noreferrer">
                            <img src="assets/logo_internet2.png" className="img-fluid float-right" alt="Internet 2 Logo" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;