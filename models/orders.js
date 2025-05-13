/**
 * @author Jerome Dass
 */

'use strict';

import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const OrderSchema = new Schema(
    {
        cart_id: { type: Schema.Types.ObjectId, required: true },
        products: [{
            _id: false,
            id: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }],
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
);

export default Mongoose.model('orders', OrderSchema);