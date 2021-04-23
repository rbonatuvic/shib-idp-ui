import { useContext } from 'react';
import { I18nContext } from './context/I18n.provider';

export function useCurrentLanguage () {

}

export function useCurrentLocale () {

}

export function useTranslation (value, interpolated = {}) {
    const messages = useContext(I18nContext);
    let val = messages.hasOwnProperty(value) ? messages[value] : (Object.keys(messages).length ? value : '');
    return useInterpolatedTranslation(val, interpolated);
}

export function useInterpolatedTranslation(value, interpolated) {
    return Object.entries(interpolated).reduce((current, interpolate) => {
        let reg = new RegExp(`{\\s*${interpolate[0]}\\s*}`, 'gm');
        return current.replace(reg, interpolate[1]);
    }, value);
}
