/**
 * @author Jerome Dass
 */

'use strict';

import Errors from './custom-errors.js';
import Mongoose from 'mongoose';

export default async function(error, req, res) {
	let responseError = error;
	// handle mongodb cast error
	if (responseError instanceof Mongoose.Error.CastError) {
		// handle invalid ObjectId
		if (responseError.kind === 'ObjectId') {
			responseError = new Errors.BadRequestError(null, `${responseError.value} is not a valid ObjectId`);
		}
	}
	// handle acl error
	if (responseError.name === 'AccessControlError') {
		responseError.statusCode = 401;
		responseError.errorCode = Errors.CODES.ERR_MISSING_PERMISSION;
	}
	if (!responseError.statusCode && !responseError.code) {
		responseError = new Errors.InternalServerError(
			'Internal Error',
			responseError?.errmsg || responseError?.message || 'An error occurred, please try again later',
		);
	} else if (responseError.code) {
		// mongo db error
		responseError = new Errors.BadRequestError(responseError.code, responseError.errmsg || responseError.message);
	}
	res.status(responseError.statusCode);

	let errorMessage = '';
	if (typeof res.__ == 'function') {
		if (typeof responseError.innerError == 'object') {
			errorMessage = res.__(responseError.innerError.message, responseError.innerError.variables);
			responseError.message = errorMessage;
			responseError.innerError.message = errorMessage;
		} else {
			errorMessage = res.__(responseError.message);
			responseError.message = errorMessage;
		}
	} else {
		errorMessage = responseError.message;
	}
	res.send({
		success: false,
		message: errorMessage,
		errorCode: responseError.errorCode,
		data: responseError,
	});
}