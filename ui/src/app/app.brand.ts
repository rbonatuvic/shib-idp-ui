import { brand as customBrand } from '../brand';
import { Brand } from './core/model/brand';

export const brand: Brand = {
    header: {
        title: 'Source Management'
    },
    logo: {
        default: '/assets/shibboleth_logowordmark_color.png',
        small: '/assets/shibboleth_icon_color_130x130.png',
        large: '/assets/shibboleth_logowordmark_color.png',
        alt: 'Shibboleth Logo - Click to be directed to www.shibboleth.net',
        link: {
            label: 'Shibboleth',
            url: 'https://www.shibboleth.net/'
        }
    },
    footer: {
        links: [
            {
                label: 'Home Page',
                url: 'https://www.shibboleth.net/',
                description: 'Shibboleth.net open-source community home page'
            },
            {
                label: 'Wiki',
                url: 'https://wiki.shibboleth.net/',
                description: 'Shibboleth.net open-source community wiki'
            },
            {
                label: 'Issue Tracker',
                url: 'https://issues.shibboleth.net/',
                description: 'Shibboleth.net open-source community issue tracker'
            },
            {
                label: 'Mailing List',
                url: 'https://www.shibboleth.net/community/lists/',
                description: 'Shibboleth.net open-source community mailing list'
            }
        ],
        text: 'Links to Shibboleth resources:'
    },
    ...customBrand
};
