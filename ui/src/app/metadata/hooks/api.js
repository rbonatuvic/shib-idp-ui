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

export function useMetadataEntities(type = 'source') {
    return useFetch(`${API_BASE_PATH}${getMetadataListPath(type)}`);
}

export function useMetadataEntity(type = 'source') {
    return useFetch(`${API_BASE_PATH}${getMetadataPath(type)}`);
}

export function useMetadataProviderOrder() {
    return useFetch(`${API_BASE_PATH}/MetadataResolversPositionOrder`)
}

export function useMetadataSchema() {
    return useFetch(`${API_BASE_PATH}/ui`);
}
