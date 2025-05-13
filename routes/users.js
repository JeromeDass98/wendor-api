/**
 * @author Jerome Dass
 */

'use strict';

import UserPayload from '../schema/users.js';
import { verify } from '../middlewares/auth.js';
import UserController from '../controllers/users.js';

export default async function(fastify, options) {

    fastify.post('/login', async (req, res) => {
        const data = await UserController.login(req.body);
        res.send({ success: true, data: data });
    });

    fastify.get('/users', { preHandler: verify }, async (req, res) => {
        const data = await UserController.get(req.criteria);
        res.send({ success: true, data: data });
    });

    fastify.post('/users', { schema: UserPayload, preHandler: verify }, async (req, res) => {
        await UserController.create(req.body);
        res.send({ success: true });
    });

    fastify.get('/users/count', { preHandler: verify }, async (req, res) => {
        const data = await UserController.count(req.criteria);
        res.send({ success: true, data: data });
    });
}