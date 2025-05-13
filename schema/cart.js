/**
 * @author Jerome Dass
 */

'use strict';

export default {
    body: {
        type: 'object',
        required: ['product_id', 'action'],
        properties: {
            product_id: { type: 'string' },
            action: { type: 'string', enum: ['add', 'minus'] }
        },
    },
};
