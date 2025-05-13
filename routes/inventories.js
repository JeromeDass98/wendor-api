/**
 * @author Jerome Dass
 */

'use strict';

import { verify } from '../middlewares/auth.js';
import InventoryPayload from '../schema/inventories.js';
import InventoryController from '../controllers/inventories.js';

export default async function(fastify, options) {

    fastify.post('/inventories', { schema: InventoryPayload }, async (req, res) => {
        const data = await InventoryController.create(req.body);
        res.send({ success: true, data: data });
    });

    fastify.post('/inventories/bulk', { preHandler: verify }, async (req, res) => {
        const data = await InventoryController.createBulk(req.body);
        res.send({ success: true, data: data });
    });

    fastify.get('/inventories', async (req, res) => {
        const data = await InventoryController.get(req.criteria);
        res.send({ success: true, data: data });
    });

    fastify.get('/inventories/count', (req, res) => {
        InventoryController.count(req.criteria)
            .then((data) => res.send({ success: true, data }))
    });

    fastify.put('/inventories/:id', { preHandler: verify }, async (req, res) => {
        const data = InventoryController.update(req.params.id, req.body);
        res.send({ success: true, data })
    });
}