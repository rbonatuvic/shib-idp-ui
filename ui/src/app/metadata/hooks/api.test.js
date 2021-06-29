import {
    getMetadataPath,
    details,
    useNonAdminSources,
    useMetadataEntities,
    getMetadataListPath,
    getSchemaPath,
    lists,
    schema,
    useMetadataEntity,
    useMetadataFilters,
    useMetadataEntityXml,
    useMetadataProviderOrder,
    useMetadataHistory,
    useMetadataSources,
    useMetadataProviders,
    useMetadataProviderTypes,
    useMetadataAttribute,
    useMetadataAttributes,
    useMetadataUpdater,
    xmlRequestInterceptor,
    useMetadataFilterTypes
} from './api';

import useFetch from 'use-http';
import API_BASE_PATH from '../../App.constant';
import { MetadataFilterTypes } from '../domain/filter';
import { useContentionDispatcher } from '../contention/ContentionContext';

jest.mock('use-http');
jest.mock('../contention/ContentionContext');

describe('api hooks', () => {

    let mockPut;
    let mockGet;

    beforeEach(() => {

        mockPut = jest.fn().mockResolvedValue({response: { ok: true }});
        mockGet = jest.fn().mockResolvedValue({ response: { ok: true } });

        useFetch.mockImplementation(() => {
            return {
                request: {
                    ok: true
                },
                put: mockPut,
                get: mockGet,
                error: null,
                response: {
                    status: 409
                }
            };
        });
    })

    describe('getMetadataPath', () => {
        it('should return the correct path', () => {
            expect(getMetadataPath('source')).toEqual(`/${details['source']}`);
        });
    });

    describe('getMetadataListPath', () => {
        it('should return the correct path', () => {
            expect(getMetadataListPath('source')).toEqual(`/${lists['source']}`);
        });
    });

    describe('getSchemaPath', () => {
        it('should return the correct path', () => {
            expect(getSchemaPath('source')).toEqual(`/${schema['source']}`);
        });
    });

    describe('useNonAdminSources', () => {
        it('should call useFetch', () => {
            const sources = useNonAdminSources();
            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataPath('source')}/disabledNonAdmin`, { "cachePolicy": "no-cache" })
        })
    });

    describe('useMetadataEntities', () => {
        it('should call useFetch', () => {
            const type = 'source';
            const opts = {};
            const onMount = [];
            const sources = useMetadataEntities(type, opts, onMount);
            
            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataListPath(type)}`, opts, onMount)
        });

        it('should accept options', () => {
            const type = 'source';
            const opts = {};
            const sources = useMetadataEntities(type);

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataListPath(type)}`, opts, undefined)
        });
    });

    describe('useMetadataEntity', () => {
        it('should call useFetch', () => {
            const type = 'source';
            const opts = {};
            const onMount = [];
            const sources = useMetadataEntity(type, opts, onMount);

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataPath(type)}`, opts)
        });

        it('should accept options', () => {
            const type = 'source';
            const opts = {};
            const sources = useMetadataEntity(type);

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataPath(type)}`, {
                ...opts,
                cachePolicy: 'no-cache'
            })
        });
    });

    describe('useMetadataFilters', () => {

        it('should call useFetch', () => {
            const type = 'source';
            const opts = {};
            const onMount = [];
            const id = 'foo';
            const sources = useMetadataFilters(id, opts, onMount);

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataPath('provider')}/${id}/Filters`, opts, onMount)
        });

        it('should accept options', () => {
            const type = 'source';
            const id = 'foo'
            const opts = {};
            const sources = useMetadataFilters(id);

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataPath('provider')}/${id}/Filters`, {
                ...opts,
                cachePolicy: 'no-cache'
            }, undefined)
        });
    });

    describe('useMetadataEntityXml', () => {
        it('should call useFetch', () => {
            const type = 'source';
            const opts = {};
            const onMount = [];
            const sources = useMetadataEntityXml(type, opts, onMount);

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataPath(type)}`, opts)
        });

        it('should add xml to the headers', () => {
            const options = {
                headers: {}
            };
            expect(xmlRequestInterceptor({options})).toEqual({
                headers: {
                    'Accept': 'application/xml'
                }
            })
        })
    });

    describe('useMetadataProviderOrder', () => {
        it('should call useFetch', () => {
            const entities = useMetadataProviderOrder();

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}/MetadataResolversPositionOrder`, {
                cachePolicy: 'no-cache'
            })
        });
    });

    describe('useMetadataHistory', () => {
        it('should call useFetch', () => {
            const type = 'source';
            const id = 'foo'
            const entities = useMetadataHistory(type, id, {
                cachePolicy: 'no-cache'
            });

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataPath(type)}/${id}/Versions`, {
                cachePolicy: 'no-cache'
            }, undefined)
        });
    });

    describe('useMetadataSources', () => {
        it('should call useFetch', () => {
            const entities = useMetadataSources({
                cachePolicy: 'no-cache'
            });

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataListPath('source')}`, {
                cachePolicy: 'no-cache'
            }, undefined)
        });
    });

    describe('useMetadataProviders', () => {
        it('should call useFetch', () => {
            const entities = useMetadataProviders({
                cachePolicy: 'no-cache'
            });

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}${getMetadataListPath('provider')}`, {
                cachePolicy: 'no-cache'
            }, undefined)
        });
    });

    describe('useMetadataProviderTypes', () => {
        it('should call useFetch', () => {
            const entities = useMetadataProviderTypes({
                cachePolicy: 'no-cache'
            });

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}/ui/MetadataResolver/types`, {
                cachePolicy: 'no-cache'
            }, null)
        });
    });

    describe('useMetadataAttributes', () => {
        it('should call useFetch', () => {
            const entities = useMetadataAttributes({
                cachePolicy: 'no-cache'
            });

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}/custom/entity/attributes`, {
                cachePolicy: 'no-cache'
            }, undefined)
        });
    });

    describe('useMetadataAttribute', () => {
        it('should call useFetch', () => {
            const entities = useMetadataAttribute({
                cachePolicy: 'no-cache'
            });

            expect(useFetch).toHaveBeenCalledWith(`${API_BASE_PATH}/custom/entity/attribute`, {
                cachePolicy: 'no-cache'
            }, undefined)
        });
    });

    describe('useMetadataFilterTypes', () => {
        it('should return types', () => {
            expect(useMetadataFilterTypes()).toEqual(MetadataFilterTypes);
        })
    })

    describe('useMetadataUpdater', () => {

        beforeEach(() => {
            useContentionDispatcher.mockImplementation(() => jest.fn());
        })

        it('should call useFetch', async () => {

            const { update } = useMetadataUpdater('foo', {});

            const promise = update('bar', {});

            expect(useFetch).toHaveBeenCalledWith(`foo`, {
                cachePolicy: 'no-cache'
            });

            expect(mockPut).toHaveBeenCalled();
        });
    });
});