/**
 * @author Jerome Dass
 */

'use strict';

import customErrors from '../middlewares/custom-errors.js';
import Inventory from '../models/Inventories.js';
import { RabbitMq } from '../middlewares/rabbitmq.js';

export default class InventoryController {

    static create(document) {
        return Inventory.create(document);
    }

    static async createBulk(document) {
        RabbitMq.pushToQueue('wendor_daemon', {
            url: document.url,
            type: 'create-inventory'
        });
    }

    static get(criteria) {
        return Inventory.find(criteria.filter, criteria.fields, criteria.options).lean();
    }

    static count(criteria) {
        return Inventory.countDocuments(criteria.filter).lean();
    }

    static update(id, document) {
        return Inventory.findOneAndUpdate({ _id: id }, document, { new: true });
    }
}