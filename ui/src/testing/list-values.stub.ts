import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReleaseAttribute } from '../app/metadata/domain/model/properties/release-attribute';
import { debounceTime, distinctUntilChanged, combineLatest } from 'rxjs/operators';

@Injectable()
export class MockListValueService {

    constructor() { }

    readonly nameIdFormats: Observable<string[]> = of([
        'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
        'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
        'urn:oasis:names:tc:SAML:2.0:nameid-format:transient'
    ]);

    readonly authenticationMethods: Observable<string[]> = of([
        'https://refeds.org/profile/mfa',
        'urn:oasis:names:tc:SAML:2.0:ac:classes:TimeSyncToken',
        'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'
    ]);

    get attributesToRelease(): Observable<ReleaseAttribute[]> {
        return of([]);
    }

    searchStringList = (list: Observable<string[]>): Function =>
        (text$: Observable<string>) =>
            text$.pipe(
                debounceTime(100),
                distinctUntilChanged(),
                combineLatest(
                    list,
                    (term, formats) => formats.filter(
                        v => v.toLowerCase().match(term.toLowerCase())
                    )
                        .slice(0, 4))
            )

    get searchFormats(): Function {
        return this.searchStringList(this.nameIdFormats);
    }
    get searchAuthenticationMethods(): Function {
        return this.searchStringList(this.authenticationMethods);
    }
}
