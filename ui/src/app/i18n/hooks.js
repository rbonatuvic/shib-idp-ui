import { useContext } from 'react';
import { I18nContext } from './context/I18n.provider';

export function translate(value, interpolated) {
    return Object.entries(interpolated).reduce((current, interpolate) => {
        let reg = new RegExp(`{\\s*${interpolate[0]}\\s*}`, 'gm');
        return current.replace(reg, interpolate[1]);
    }, value);
}

export function getMessage(value, messages) {
    return messages.hasOwnProperty(value) ? messages[value] : (Object.keys(messages).length ? value : '');
}

export function useCurrentLanguage () {

}

export function useCurrentLocale () {

}

export function useTranslation (value, interpolated = {}) {
    const messages = useContext(I18nContext);
    const val = getMessage(value, messages);
    return useInterpolatedTranslation(val, interpolated);
}

export function useTranslator() {
    const messages = useContext(I18nContext);
    return (value, interpolated = {}) => translate(getMessage(value, messages), interpolated);
}

export function useInterpolatedTranslation(value, interpolated) {
    return translate(value, interpolated);
}