export interface Brand {
    logo: Logo;
    footer: Footer;
    header: Header;
}

export interface Header {
    title: string;
}

export interface Logo {
    default: string;
    small: string;
    large: string;
    alt: string;
    link: Link;
    [propName: string]: any;
}

export interface Footer {
    links: Link[];
    text: string;
}

export interface Link {
    label: string;
    url: string;
    description?: string;
}
