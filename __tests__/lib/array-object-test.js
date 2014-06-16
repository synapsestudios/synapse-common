'use strict';

jest.dontMock('../../lib/array-object');

describe('array-object', function() {
    var arrayObject;

    beforeEach(function() {
        arrayObject = require('../../lib/array-object');
    });

    describe('push', function() {
        it('pushes a new element onto the end of the array', function() {
            var value = 'foobar';

            arrayObject.push(value);

            expect(arrayObject.get(0)).toBe(value);
        });
    });

    describe('remove', function() {
        it ('deletes the property at the specified key', function() {
            var thirdValue = 1.01;

            arrayObject.push(1);
            arrayObject.push('string');
            arrayObject.push(thirdValue);

            expect(arrayObject.get(2)).toBe(thirdValue);

            arrayObject.remove(2);

            expect(arrayObject.get(2)).toBe(undefined);
        });
    });
});
