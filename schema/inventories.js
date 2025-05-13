/**
 * @author Jerome Dass
 */

'use strict';

export default {
    body: {
        type: 'object',
        required: ['price', 'name', 'stock'],
        properties: {
            price: { type: 'number' },
            name: { type: 'string' },
            stock: { type: 'number' }
        },
    },
};
