/* global describe, it, beforeEach */
/* jshint -W024 */ // Ignore reserved word errors
/* jshint expr: true */
'use strict';

var expect = require('chai').expect;

var ArrayObject      = require('../../lib/array-object');
var ArrayObjectError = require('../../lib/array-object-error');

describe('array-object', function() {
    var arrayObject;

    beforeEach(function() {
        arrayObject = new ArrayObject();
    });

    describe('push', function() {
        it('pushes a new element onto the end of the array', function() {
            var value = 'foobar';

            arrayObject.push(value);

            expect(arrayObject.get(0)).to.equal(value);
        });

        it('increments the key used for adding new elements', function () {
            expect(arrayObject.count).to.equal(0);

            arrayObject.push('foo');

            expect(arrayObject.count).to.equal(1);

            arrayObject.push('food');

            expect(arrayObject.count).to.equal(2);

            arrayObject.push('foosball');

            expect(arrayObject.count).to.equal(3);
        });

        it('does not re-use a key after its element has been removed', function () {
            arrayObject.push('foo');
            arrayObject.push('food');

            expect(arrayObject.get(1)).to.equal('food');

            arrayObject.remove(1);
            arrayObject.push('foosball');

            expect(arrayObject.get(1)).to.equal(undefined);
        });
    });

    describe('remove', function() {
        it ('deletes the property at the specified key', function() {
            var thirdValue = 1.01;

            arrayObject.push(1);
            arrayObject.push('string');
            arrayObject.push(thirdValue);

            expect(arrayObject.get(2)).to.equal(thirdValue);

            arrayObject.remove(2);

            expect(arrayObject.get(2)).to.equal(undefined);
        });
    });

    describe('edit', function() {

        it('edits the element at the specified index', function () {
            arrayObject.push('foo');

            expect(arrayObject.get(0)).to.equal('foo');

            arrayObject.edit(0, 'bar');

            expect(arrayObject.get(0)).to.equal('bar');
        });

        it('throws an exception if index is not an integer', function () {
            var invalidIndex, expectedErrorMessage;

            invalidIndex = 'foo';
            expectedErrorMessage = 'Index must be an integer, ' + invalidIndex + ' provided';

            expect(function () {
                arrayObject.edit(invalidIndex, 'bar');}
            ).to.throw(ArrayObjectError, expectedErrorMessage);
        });

        it('throws an exception if index has not yet been set', function() {
            var outOfBoundsIndex, expectedErrorMessage;

            arrayObject.push(1);
            arrayObject.push(2);
            arrayObject.push(3);

            outOfBoundsIndex = 17;
            expectedErrorMessage = 'Element ' + outOfBoundsIndex + ' not yet defined in arrayObject';

            expect(function () {
                arrayObject.edit(outOfBoundsIndex, 'bar');
            }).to.throw(ArrayObjectError, expectedErrorMessage);
        });
    });

    describe('get', function() {
        it('gets the object at the specified index', function() {
            arrayObject.push('foo');
            arrayObject.push('bar');
            arrayObject.push('baz');

            expect(
                arrayObject.get(0)
            ).to.equal('foo');

            expect(
                arrayObject.get(1)
            ).to.equal('bar');

            expect(
                arrayObject.get(2)
            ).to.equal('baz');
        });
    });

    describe('getAsArray', function() {
        it('returns an empty array if no items pushed onto array-object', function() {
            expect(
                arrayObject.getAsArray()
            ).to.eql(
                []
            );
        });

        it('returns the array-object as an array', function() {
            var expectedArrayValue;

            arrayObject.push('foo');
            arrayObject.push('bar');
            arrayObject.push('baz');
            arrayObject.push(1);
            arrayObject.push(2);
            arrayObject.push(3.14159);

            expectedArrayValue = [
                'foo',
                'bar',
                'baz',
                1,
                2,
                3.14159
            ];

            expect(
                arrayObject.getAsArray()
            ).to.eql(
                expectedArrayValue
            );
        });

        it('does not return elements that have been deleted inside the array', function() {
            arrayObject.push('foo');
            arrayObject.push('bar');
            arrayObject.push('baz');

            // Demonstrate first that the array returned contains the value to be removed
            expect(arrayObject.getAsArray()).to.contain('bar');

            arrayObject.remove(1);

            expect(arrayObject.getAsArray()).not.to.contain('bar');
        });
    });
});
