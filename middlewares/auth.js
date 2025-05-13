/**
 * @author Jerome Dass
 */

'use strict';

import jwt from 'jsonwebtoken';
import Users from '../models/users.js';
import CustomErrors from './custom-errors.js';

export async function verify(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomErrors.UnauthorizedError('INVALID_TOKEN', 'Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Users.findOne({ _id: decoded._id }).lean();
      if (!user) {
        throw new CustomErrors.UnauthorizedError('INVALID_TOKEN', 'User Not Found');
      }
    } catch (err) {
      throw new CustomErrors.UnauthorizedError('INVALID_TOKEN', 'Invalid token');
    }
}

export function create(user) {
    const secret = process.env.JWT_SECRET; // keep this secret safe!
    const expiresIn = '10h';

    const token = jwt.sign(user, secret, { expiresIn });

    return token;
}