import useFetch from 'use-http';

import API_BASE_PATH from '../../App.constant';

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

export function getMetadataListPath(type) {
    return `/${lists[type]}`;
}

export function getSchemaPath(type) {
    return `/${schema[type]}`;
}

export function useMetadataEntities(type = 'source', opts = {}) {
    return useFetch(`${API_BASE_PATH}${getMetadataListPath(type)}`, opts);
}

export function useMetadataEntity(type = 'source', opts = {}) {
    return useFetch(`${API_BASE_PATH}${getMetadataPath(type)}`, opts);
}

export function useMetadataProviderOrder() {
    return useFetch(`${API_BASE_PATH}/MetadataResolversPositionOrder`)
}

export function useMetadataSchema() {
    return useFetch(`${API_BASE_PATH}/ui`);
}
