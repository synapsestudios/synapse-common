'use strict';

function HttpError(message, response) {
    this.name     = 'HttpError';
    this.message  = message || 'Unknown error';
    this.response = response;
    this.stack    = (new Error()).stack;
}

HttpError.prototype = Error.prototype;
HttpError.prototype.constructor = HttpError;

module.exports = HttpError;
