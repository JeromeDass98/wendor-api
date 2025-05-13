/**
 * @author Jerome Dass
 */

'use strict';

export default {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string' },
            password: { type: 'string' }
        },
    },
};
