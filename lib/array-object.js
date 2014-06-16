'use strict';

/**
 * Object that represents a simple numerically indexed hash
 *
 * Keys are preserved so that React can set persistent keys on associated fields
 */
module.exports = {

    /**
     * An object representing a numerically keyed array (Technically a hash)
     *
     * @type Object
     */
    arrayObject : {},

    /**
     * Key of next element to add to the arrayObject
     *
     * @type integer
     */
    count : 0,

    /**
     * Push a new element onto the end of the array
     *
     * @param  mixed value Value to push
     */
    push : function(value)
    {
        this.arrayObject[this.count] = value;

        this.count += 1;
    },

    /**
     * Delete the element at the given index
     *
     * @param  int|string index Index of the element to change
     */
    remove : function(index)
    {
        delete this.arrayObject[index];
    },

    /**
     * Edit the element at the given index
     *
     * @param  int|string index Index of the element to change
     * @param  mixed      value New value of the element
     */
    edit : function(index, value)
    {
        var isInt = (parseFloat(index) === parseInt(index, 10) && ! isNaN(index));

        if (! isInt) {
            throw 'Index must be an integer, ' + index + ' provided';
        }

        if (index > this.count) {
            throw 'Element ' + index + ' not yet defined in arrayObject';
        }

        this.arrayObject[index] = value;
    },

    /**
     * Get the element at the given index
     *
     * @param  int   index
     * @return mixed
     */
    get : function(index)
    {
        return this.arrayObject[index];
    },

    /**
     * Get the array object as an array
     *
     * @return array
     */
    getAsArray: function()
    {
        var array = [];

        this.forEach(function (value, index) {
            array.push(value);
        });

        return array;
    },

    /**
     * Implementation of forEach to iterate over the array object
     *
     * Expects a callback with an identical format to Array.prototype.forEach
     *
     * @param  {Function} callback Callback to call on each element of this.arrayObject
     */
    forEach : function(callback)
    {
        for (var key in this.arrayObject) {
            var value = this.arrayObject[key];

            callback(value, key);
        }
    }
};
