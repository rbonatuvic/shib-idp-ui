const invisErrors = ['const', 'oneOf'];

export const transformErrors = (errors) => {

    let list = [
        ...errors.filter(e => invisErrors.indexOf(e.name) === -1)
    ].map(e => {
        if (e.name === 'pattern') {
            if (e.property.includes('email')) {
                e.message = 'message.valid-email';
            } else {
                e.message = 'message.valid-duration';
            }
        }

        if (e.name === 'type') {
            if (e.message === 'should be string') {
                e.message = 'message.required'
            }
        }
        return e;
    });

    return list;
}