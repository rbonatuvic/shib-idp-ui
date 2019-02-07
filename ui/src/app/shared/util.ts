import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';

export interface RouterStateUrl {
    url: string;
    queryParams: Params;
}

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        const { url } = routerState;
        const queryParams = routerState.root.queryParams;

        return { url, queryParams };
    }
}

export function removeNulls(attribute: any, discardObjects: boolean = false): any {
    if (!attribute) { return {}; }
    let removed = Object.keys(attribute).reduce((coll, val, index) => {
        if (attribute[val] !== null) {
            if (!discardObjects || checkByType(attribute[val])) {
                coll[val] = attribute[val];
            }
        }
        return coll;
    }, {});
    return removed;
}

export function checkByType(value): boolean {
    switch (typeof value) {
        case 'object': {
            return Object.keys(value).filter(k => !!value[k]).length > 0;
        }
        default: {
            return true;
        }
    }
}

export function pick(approvedProperties: string[]): Function {
    return (original) =>
        Object.keys(original)
            .filter((key) => approvedProperties.indexOf(key) > -1)
            .reduce((newObj, key) => {
                let value = original[key];
                newObj[key] = value;
                return newObj;
            }, {});
}

export function array_move(arr, old_index, new_index): any[] {
    if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

export function getCurrentLanguage(navigator: any = null): string {
    return getCurrentLocale(navigator).split('-', 1)[0];
}

export function getCurrentCountry(navigator: any = null): string {
    return getCurrentLocale(navigator).split('-', 1)[1];
}

export function getCurrentLocale(nav: any = null): string {
    nav = nav || navigator;
    const getLocaleId = (lang: string) => lang.trim();
    // supported regional languages
    const supportedLanguages: string[] = ['en', 'es', 'en-US', 'es-ES'].map(lang => getLocaleId(lang));
    // language code without regional details
    const shortSupportedLanguages: string[] = supportedLanguages.map(lang => lang.substring(0, 2));

    // look for an exact match to a regional translation
    let preferredLanguage = getLocaleId(nav.language);
    if (supportedLanguages.includes(preferredLanguage)) {
        return preferredLanguage;
    }

    // for language only match, no regional details
    let shortPreferredLanguage: string = preferredLanguage.substring(0, 2);
    let index = shortSupportedLanguages.indexOf(shortPreferredLanguage);
    if (index > -1) {
        return supportedLanguages[index];
    }

    // not all browsers share full language list
    if (nav.languages instanceof Array) {
        // get list of all languages user understands, check for an exact regional match
        const allPreferredLanugages: string[] = nav.languages.map(lang => getLocaleId(lang));
        preferredLanguage = allPreferredLanugages.find(language => supportedLanguages.includes(language));
        if (preferredLanguage) {
            return preferredLanguage;
        }

        // from list of all languages user understand, check for language only match
        const shortAllPreferredLanugages: string[] = allPreferredLanugages.map(language => language.substring(0, 2));
        index = shortAllPreferredLanugages.findIndex(language => shortSupportedLanguages.includes(language));
        if (index > -1) {
            return supportedLanguages[index];
        }
    }

    // if no match has been found return first (default) language
    return supportedLanguages[0];
}
