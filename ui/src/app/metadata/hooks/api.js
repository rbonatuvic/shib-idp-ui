import useFetch from 'use-http';

import API_BASE_PATH from '../../App.constant';

const paths = {
    source: 'EntityDescriptor',
    provider: 'MetadataResolver'
};

const schema = {
    source: 'MetadataSources'
}

export function getMetadataPath(type) {
    return `/${paths[type]}`;
}

export function getSchemaPath(type) {
    return `/${schema[type]}`;
}

export function useMetadataEntities(type = 'source') {
    return useFetch(`${API_BASE_PATH}${getMetadataPath(type)}s`);
}

export function useMetadataEntity(type = 'source') {
    return useFetch(`${API_BASE_PATH}${getMetadataPath(type)}`);
}


export function useMetadataSchema() {
    return useFetch(`${API_BASE_PATH}/ui`);
}
