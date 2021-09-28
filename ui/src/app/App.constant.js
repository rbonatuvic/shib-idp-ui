export const getBasePath = () => {
    const url = new URL(document.getElementsByTagName('base')[0].href);
    return url.pathname?.replace(/^\/+/g, '');

    //replace(/^\/|\/$/g, '')
};

export const BASE_PATH = getBasePath();
export const API_BASE_PATH = `${BASE_PATH}api`;

export const FILTER_PLUGIN_TYPES = ['RequiredValidUntil', 'SignatureValidation', 'EntityRoleWhiteList'];

export default API_BASE_PATH;
