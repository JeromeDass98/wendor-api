/**
 * @author Jerome Dass
 */

'use strict';

import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const CartSchema = new Schema(
    {
        products: [{
            _id: false,
            id: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }],
        status: { type: String, enum: ['active', 'ordered', 'cancelled'] }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
);

export default Mongoose.model('carts', CartSchema);