/**
 * @author Jerome Dass
 */

'use strict';

import Mongoose from 'mongoose';

const InventorySchema = new Mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        image: String
    },
    {
        timestamps: {
            createdAt: 'created_at',
			updatedAt: 'updated_at',
        }
    }
);

export default Mongoose.model('inventories', InventorySchema);