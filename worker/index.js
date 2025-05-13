/**
 * @author Jerome Dass
 */

'use strict';

import dotenv from 'dotenv';
dotenv.config({});

import { RabbitMq } from '../middlewares/rabbitmq.js';
import BulkInventory from './bulk-inventory.js';
import Mongoose from 'mongoose';

const handlers = {
    'create-inventory': BulkInventory,
};

try {
    Mongoose.connect(process.env.MONGODB_URL)
    RabbitMq.ListenToQueue('wendor_daemon', async (message) => {
        try {
            const handler = new handlers[message.type](message);
            await handler.execute();
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    });
} catch (err) {
    console.error(err);
}

const handleError = (type, error) => {
    console.log('Error type', type);
	console.log(error);
	setTimeout(() => {
		process.exit(1000);
	}, 1000);
};

process.on('uncaughtException', (error) => handleError('Uncaught Exception', error));
process.on('unhandledRejection', (error) => handleError('Unhandled Rejection', error));