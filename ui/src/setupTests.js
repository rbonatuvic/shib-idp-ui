// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;
/*
const documentCookieMock = {
    cookies: '',

    get cookie() {
        return this.cookies;
    },

    set cookie(cookieValue) {
        const cookies = this.cookies.split(' ');
        const cookieName = cookieValue.split('=').shift();
        const cookieNameLength = cookieName.length;
        let cookieIndex = -1;
        cookies.forEach((value, index) => {
            if (`${value.substr(0, cookieNameLength)}=` === `${cookieName}=`) {
                cookieIndex = index;
            }
        });
        if (cookieIndex > -1) {
            cookies[cookieIndex] = `${cookieValue};`;
        } else {
            cookies.push(`${cookieValue};`);
        }
        this.cookies = cookies.join(' ').trim();
    },
};

global.document.cookie = documentCookieMock;*/