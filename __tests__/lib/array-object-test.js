'use strict';

jest.dontMock('../../lib/array-object');
jest.dontMock('underscore');

describe('array-object', function() {
    var arrayObject;

    beforeEach(function() {
        arrayObject = require('../../lib/array-object');
    });

    describe('push', function() {
        it('pushes a new element onto the end of the array', function() {
            var value = 'foobar';

            arrayObject.push(value);

            expect(
                arrayObject.get(0)
            ).toBe(value);
        });
    });

    describe('remove', function() {
        it ('deletes the property at the specified key', function() {
            var thirdValue = 1.01;

            arrayObject.push(1);
            arrayObject.push('string');
            arrayObject.push(thirdValue);

            expect(
                arrayObject.get(2)
            ).toBe(thirdValue);

            arrayObject.remove(2);

            expect(
                arrayObject.get(2)
            ).toBe(undefined);
        });
    });

    describe('edit', function() {
        it('edits the element at the specified index', function () {
            arrayObject.push('foo');

            expect(arrayObject.get(0)).toBe('foo');

            arrayObject.edit(0, 'bar');

            expect(
                arrayObject.get(0)
            ).toBe('bar');
        });

        it('throws an exception if index is not an integer', function () {
            var invalidIndex = 'foo',
                expectedExceptionMessage;

            expectedExceptionMessage = 'Index must be an integer, ' + invalidIndex + ' provided';

            expect(function () {
                arrayObject.edit(invalidIndex, 'bar');
            }).toThrow(expectedExceptionMessage);
        });

        it('throws an exception if index has not yet been set', function() {
            var outOfBoundsIndex = 17,
                expectedExceptionMessage;

            arrayObject.push(1);
            arrayObject.push(2);
            arrayObject.push(3);

            expectedExceptionMessage = 'Element ' + outOfBoundsIndex + ' not yet defined in arrayObject';

            expect(function () {
                arrayObject.edit(outOfBoundsIndex, 'bar');
            }).toThrow(expectedExceptionMessage);
        });
    });

    describe('get', function() {
        it('gets the object at the specified index', function() {
            arrayObject.push('foo');
            arrayObject.push('bar');
            arrayObject.push('baz');

            expect(
                arrayObject.get(0)
            ).toBe('foo');

            expect(
                arrayObject.get(1)
            ).toBe('bar');

            expect(
                arrayObject.get(2)
            ).toBe('baz');
        });
    });

    describe('getAsArray', function() {
        it('returns an empty array if no items pushed onto array-object', function() {
            expect(
                arrayObject.getAsArray()
            ).toEqual(
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
                3.14159,
            ];

            expect(
                arrayObject.getAsArray()
            ).toEqual(
                expectedArrayValue
            );
        });

        it('does not return elements that have been deleted inside the array', function() {
            arrayObject.push('foo');
            arrayObject.push('bar');
            arrayObject.push('baz');

            // Demonstrate first that the array returned contains the value to be removed
            expect(
                arrayObject.getAsArray()
            ).toContain(
                'bar'
            );

            arrayObject.remove(1);

            expect(
                arrayObject.getAsArray()
            ).not.toContain(
                'bar'
            );
        });
    })
});
