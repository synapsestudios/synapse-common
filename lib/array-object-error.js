'use strict';

function ArrayObjectError(message, response) {
    this.name     = 'ArrayObjectError';
    this.message  = message || 'Unknown error';
    this.response = response;
    this.stack    = (new Error()).stack;
}

ArrayObjectError.prototype = Error.prototype;
ArrayObjectError.prototype.constructor = ArrayObjectError;

module.exports = ArrayObjectError;
