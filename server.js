/**
 * @author Jerome Dass
 */

"use strict";

import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import Routes from "./routes/index.js";
import QsParser from "./middlewares/qs_parser.js";
import ErrorHandler from "./middlewares/error_handler.js";
import Mongoose from 'mongoose';
import qs from 'qs';

const fastify = Fastify({
    logger: false,
    querystringParser: str => qs.parse(str)
});

fastify.get("/health", (req, res) => {
    res.send({ success: true });
});

fastify.addHook('onRequest', (req, res, done) => {
  res.headers({
    'Access-Control-Allow-Origin': '*', // Allow all origins (change to specific origin if needed)
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Allowed methods
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
    'Access-Control-Allow-Credentials': 'true', // Allow cookies if needed (set to true if you need to send cookies)
  })

  if (req.method === 'OPTIONS') {
    res.status(200).send()
  }
  
  done();
})

fastify.setErrorHandler(ErrorHandler);

fastify.addHook('onError', ErrorHandler);

fastify.register((instance, options, done) => {
    instance.addHook("onRequest", QsParser);
    Routes.forEach((r) => instance.register(r));
    done();
});

Mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('connected to db', process.env.MONGODB_DB);
    fastify.listen({ port: process.env.PORT, host: '0.0.0.0' });
})
.then(() => {
    console.log("Server started @", process.env.PORT);
});
