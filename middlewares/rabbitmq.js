/**
 * @author Jerome Dass
 */

'use strict';

import amqp from 'amqplib';

class RabbitMQ {

    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connectRabbitMQ(rabbitUrl = 'amqp://localhost') {
        if (this.channel) return this.channel;

        try {
            this.connection = await amqp.connect(rabbitUrl);
            this.channel = await this.connection.createChannel();
            console.log('✅ Connected to RabbitMQ');
            return this.channel;
        } catch (err) {
            console.error('❌ Failed to connect to RabbitMQ:', err);
            throw err;
        }
    }

    /**
     * @description Start consuming messages from a queue
     * @param {string} queueName
     * @param {(msg: string) => void} handler
     */
    async ListenToQueue(queueName, handler) {
        const ch = await this.connectRabbitMQ();

        await ch.assertQueue(queueName, { durable: true });

        console.log(`📥 Waiting for messages in "${queueName}"`);

        ch.consume(queueName, (message) => {
            if (message !== null) {
                const content = message.content.toString();
                console.log(`➡ Received: ${content}`);
                try {
                    handler(JSON.parse(content));
                    ch.ack(message);
                } catch (err) {
                    console.error('❗ Error processing message:', err);
                    ch.nack(message, false, false); // discard message
                }
            }
        });
    }

    /**
     * @description Push a message to a RabbitMQ queue
     * @param {string} queueName
     * @param {string} msg
     */
    async pushToQueue(queueName, msg) {
        const ch = await this.connectRabbitMQ();

        // Ensure queue exists
        await ch.assertQueue(queueName, { durable: true });

        // Send the message to the queue
        ch.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), { persistent: true });

        console.log(`✅ Sent to "${queueName}"`);
    }
}

// Create a factory function to create instances with custom connection URLs
function createRabbitMqInstance(connectionUrl) {
	return new RabbitMQ(connectionUrl);
}

export const RabbitMqWithCustomConnection = createRabbitMqInstance;
export const RabbitMq = createRabbitMqInstance('default');