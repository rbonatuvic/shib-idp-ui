import { brand as customBrand } from '../brand';
import { Brand } from './core/model/brand';

export const brand: Brand = {
    header: {
        title: 'brand.header.title'
    },
    logo: {
        default: '/assets/shibboleth_logowordmark_color.png',
        small: '/assets/shibboleth_icon_color_130x130.png',
        large: '/assets/shibboleth_logowordmark_color.png',
        alt: 'brand.logo-alt',
        link: {
            label: 'brand.logo-link-label', // shibboleth
            url: 'https://www.shibboleth.net/',
            description: 'brand.logo.link-description'
        }
    },
    footer: {
        links: [
            {
                label: 'brand.footer.links-label-1',
                url: 'https://www.shibboleth.net/',
                description: 'brand.footer.links-desc-1'
            },
            {
                label: 'brand.footer.links-label-2',
                url: 'https://wiki.shibboleth.net/',
                description: 'brand.footer.links-desc-2'
            },
            {
                label: 'brand.footer.links-label-3',
                url: 'https://issues.shibboleth.net/',
                description: 'brand.footer.links-desc-3'
            },
            {
                label: 'brand.footer.links-label-4',
                url: 'https://www.shibboleth.net/community/lists/',
                description: 'brand.footer.links-desc-4'
            }
        ],
        text: 'brand.footer.text'
    },
    ...customBrand
};
