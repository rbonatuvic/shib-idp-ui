import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class ListValuesService {
    constructor() {}

    readonly nameIdFormats: Observable<string[]> = Observable.of([
        'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
        'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
        'urn:oasis:names:tc:SAML:2.0:nameid-format:transient'
    ]);

    readonly authenticationMethods: Observable<string[]> = Observable.of([
        'https://refeds.org/profile/mfa',
        'urn:oasis:names:tc:SAML:2.0:ac:classes:TimeSyncToken',
        'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'
    ]);

    readonly attributesToRelease: Observable<{ key: string, label: string }[]> = Observable.of([
        { key: 'eduPersonPrincipalName', label: 'eduPersonPrincipalName (EPPN)' },
        { key: 'uid', label: 'uid' },
        { key: 'mail', label: 'mail' },
        { key: 'surname', label: 'surname' },
        { key: 'givenName', label: 'givenName' },
        { key: 'displayName', label: 'displayName' },
        { key: 'eduPersonAffiliation', label: 'eduPersonAffiliation' },
        { key: 'eduPersonScopedAffiliation', label: 'eduPersonScopedAffiliation' },
        { key: 'eduPersonPrimaryAffiliation', label: 'eduPersonPrimaryAffiliation' },
        { key: 'eduPersonEntitlement', label: 'eduPersonEntitlement' },
        { key: 'eduPersonAssurance', label: 'eduPersonAssurance' },
        { key: 'eduPersonUniqueId', label: 'eduPersonUniqueId' },
        { key: 'employeeNumber', label: 'employeeNumber' }
    ]);

    searchStringList = (list: Observable<string[]>): Function =>
        (text$: Observable<string>) =>
            text$
                .debounceTime(100)
                .distinctUntilChanged()
                .combineLatest(list, (term, formats) => formats.filter(
                    v => v.toLowerCase().match(term.toLowerCase())
                ).slice(0, 4))

    get searchFormats(): Function {
        return this.searchStringList(this.nameIdFormats);
    }
    get searchAuthenticationMethods(): Function {
        return this.searchStringList(this.authenticationMethods);
    }
} /* istanbul ignore next */
