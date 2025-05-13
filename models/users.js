/**
 * @author Jerome Dass
 */

'use strict';

import Mongoose from 'mongoose';

const UserSchema = new Mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        user_name: { type: String, required: true },
        is_active: { type: Boolean, default: true },
        password: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
);

export default Mongoose.model('users', UserSchema);