import useFetch from 'use-http';

import API_BASE_PATH from '../../App.constant';
import { useContentionDispatcher, openContentionModalAction } from '../contention/ContentionContext';

import {MetadataFilterTypes} from '../domain/filter';

const lists = {
    source: 'EntityDescriptors',
    provider: 'MetadataResolvers'
};

const details = {
    source: 'EntityDescriptor',
    provider: 'MetadataResolvers'
}

const schema = {
    source: 'MetadataSources'
}

export function getMetadataPath(type) {
    return `/${details[type]}`;
}

export function useNonAdminSources() {
    return useFetch(`/${getMetadataPath('source')}/disabledNonAdmin`);
}

export function getMetadataListPath(type) {
    return `/${lists[type]}`;
}

export function getSchemaPath(type) {
    return `/${schema[type]}`;
}

export function useMetadataEntities(type = 'source', opts = {}, onMount) {
    return useFetch(`${API_BASE_PATH}${getMetadataListPath(type)}`, opts, onMount);
}

export function useMetadataEntity(type = 'source', opts = {
    cachePolicy: 'no-cache'
}) {
    return useFetch(`${API_BASE_PATH}${getMetadataPath(type)}`, opts);
}

export function useMetadataFilters(id, opts = {
    cachePolicy: 'no-cache'
}, onMount) {
    return useFetch(`${API_BASE_PATH}${getMetadataPath('provider')}/${id}/Filters`, opts, onMount);
}

export function useMetadataEntityXml(type = 'source', opts = {
    interceptors: {
        request: ({options}) => {
            options.headers['Accept'] = 'application/xml';
            return options;
        }
    }
}) {
    return useFetch(`${API_BASE_PATH}${getMetadataPath(type)}`, opts);
}

export function useMetadataProviderOrder() {
    return useFetch(`${API_BASE_PATH}/MetadataResolversPositionOrder`);
}

export function useMetadataHistory(type, id, opts = {}, i) {

    return useFetch(`${API_BASE_PATH}${getMetadataPath(type)}/${id}/Versions`, opts, i);

    // EntityDescriptor/d07d6122-0dd2-433e-baec-b76413b4c842/Versions
    // MetadataResolvers/4161d661-2be7-4110-9e91-539669a691e3/Versions
}

export function useMetadataSources(opts = {}, onMount) {
    return useFetch(`${API_BASE_PATH}${getMetadataListPath('source')}`, opts, onMount);
}

export function useMetadataProviders(opts = {}, onMount) {
    return useFetch(`${API_BASE_PATH}${getMetadataListPath('provider')}`, opts, onMount);
}

export function useMetadataProviderTypes(opts = {}, onMount = null) {
    return useFetch(`${API_BASE_PATH}/ui/MetadataResolver/types`, opts, onMount);
}

export function useMetadataFilterTypes () {
    return MetadataFilterTypes;
}

export function useMetadataUpdater (path, current) {
    const { request, put, get, error, response, ...props } = useFetch(path, {
        cachePolicy: 'no-cache'
    });

    const dispatch = useContentionDispatcher();

    async function update (p, body) {
        const req = await put(p, body);
        if (response.status === 409) {
            const latest = await get(p);
            return new Promise((resolve, reject) => {
                dispatch(openContentionModalAction(current, latest, body, async (resolution) => {
                    resolve(await update(p, resolution));
                }, () => {
                    reject();
                }));
            });
        }
        if (response.ok) {
            return Promise.resolve(req);
        } else {
            return Promise.reject(req);
        }
    }

    return {
        ...props,
        request,
        response,
        update,
        error
    }
}

export function useMetadataAttributes (opts = {}, onMount) {
    //
    return useFetch(`${API_BASE_PATH}/custom/entity/attributes`, opts, onMount);
}

export function useMetadataAttribute(opts = {}, onMount) {
    //
    return useFetch(`${API_BASE_PATH}/custom/entity/attribute`, opts, onMount);
}