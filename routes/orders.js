/**
 * @author Jerome Dass
 */

'use strict';

import OrderController from '../controllers/orders.js';
import CartPayload from '../schema/cart.js';

export default async function(fastify, options) {

    fastify.post('/cart', { schema: CartPayload }, async (req, res) => {
        const data = await OrderController.createCart(req.body);
        res.send({ success: true, data: data });
    });

    fastify.get('/cart', async (req, res) => {
        const data = await OrderController.getCart(req.criteria);
        res.send({ success: true, data: data });
    });

    fastify.get('/orders', async (req, res) => {
        const data = await OrderController.getOrders(req.criteria);
        res.send({ success: true, data: data });
    });

    fastify.post('/order', async (req, res) => {
        const data = await OrderController.placeOrder(req.body);
        res.send({ success: true, data: data });
    });
}