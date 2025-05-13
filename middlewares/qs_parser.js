/**
 * @author Jerome Dass
 */

'use strict';

import CustomErrors from './custom-errors.js';

export default async function(req, res) {
    req.criteria = {
        fields: req.query?.fields || '',
        options: {
            limit: !isNaN(req.query?.limit) ? parseInt(req.query.limit) : 10,
            skip: !isNaN(req.query?.skip) ? parseInt(req.query.skip) : 0,
        }
    }
    if (req.query.filter) {
        if (Array.isArray(req.query.filter)) {
            throw new CustomErrors.BadRequestError('INVALI_FILTER', 'filter cannot be array');
        }
        
        if (req.query.filter) {
            if (typeof req.query.filter === 'object') {
                req.criteria.filter = req.query.filter;
            } else if (typeof req.query.filter === 'string') {
                req.criteria.filter = JSON.parse(req.query.filter);
            }
        }
    }
}