/**
 * @author Jerome Dass
 */

'use strict';

import bcrypt from 'bcrypt';
import Users from '../models/users.js';
import { create } from '../middlewares/auth.js';
import CustomErrors from '../middlewares/custom-errors.js';

export default class UsersController {

    static async get(criteria) {
        return Users.find(criteria.filter, criteria.fields, criteria.options).lean();
    }

    static count(criteria) {
        return Users.countDocuments(criteria.filter).lean();
    }

    static async create(document) {
        const saltRounds = 10;
        document.password = await bcrypt.hash(document.password, saltRounds);
        return Users.create(document);
    }

    static async login(document) {
        const user = await Users.findOne({ $or: [{ email: document.email }, { user_name: document.email }] }).lean();
        if (!user) {
            throw new CustomErrors.NotFoundError('USER_NOT_FOUND', 'user not found');
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(document.password, saltRounds);
        if (user.password !== hash) {
            throw new CustomErrors.BadRequestError('INCORRECT_CREDENTIALS', 'password or email / user name is incorrect');
        }
        const token = create({
            _id: user._id,
            email: user.email,
            name: user.name,
            user_name: user.user_name,
        });
        return { token: `Bearer ${token}` };
    }
}