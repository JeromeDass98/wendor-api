/**
 * @desc Custom error handling.
 * @author Jerome Dass
 */

'use strict';

class AbstractError extends Error {
	constructor() {
		super();
		Error.captureStackTrace(this);
	}
}

/**
 * @param {string} name
 * @param {string} errorCode
 * @param {number} statusCode
 */
const errorFactory = function (name, errorCode, statusCode) {
	class CustomError extends AbstractError {
		/**
		 * @param {string} [errorCodeOverride]
		 * @param {any} [message]
		 * @param {Error|string} [innerError]
		 * @param {number} [statusCodeOverride]
		 */
		constructor(errorCodeOverride, message = '', innerError, statusCodeOverride) {
			super();

			this.statusCode = statusCodeOverride || statusCode;
			this.errorCode = errorCodeOverride || errorCode;
			this.innerError = innerError;
			this.message = message;
			if (message && typeof message === 'object') {
				this.message = message.message || message;
				this.innerError = innerError || message;
			}
			if (name) {
				this.name = name;
			}
			Error.captureStackTrace(this, this.constructor);
		}
	}

	return CustomError;
};

const BadRequestError = errorFactory('BadRequest', 'BAD_REQUEST', 400);
const UnauthorizedError = errorFactory('Unauthorized Request', 'UNAUTHORIZED_REQUEST', 401);
const InternalServerError = errorFactory('Internal Error', 'INTERNAL_SERVER_ERROR', 500);
const NotFoundError = errorFactory('Resource NotFound', 'RESOURCE_NOT_FOUND', 404);

export default {
    BadRequestError,
    InternalServerError,
	UnauthorizedError,
	NotFoundError,
}