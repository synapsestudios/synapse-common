/* global mocha, jasmine */
'use strict';

/**
 * Function to be used with Jest/Jasmine as a data provider
 *
 * @link https://github.com/jphpsf/jasmine-data-provider
 *
 * Example usage:
 *
 * describes('some method', function() {
 *     using('integers from 5 to 10', [5, 6, 7, 8, 9, 10], function(value) {
 *         it('should return the integer plus 1', function() {
 *             // Use `value` here
 *         });
 *     });
 * });
 *
 * @param  {String}   description Description of the set being used
 * @param  {Array}    values      Array of values to use
 * @param  {Function} func        Function containing calls to `it()`
 */
module.exports = function(description, values, func)
{
    var count = values.length;

    for (var i = 0; i < count; i += 1) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, values[i]);
        (mocha || jasmine).currentEnv_.currentSpec.description += ' (with "' + description + '" using ' + values[i].join(', ') + ')';
    }
};
