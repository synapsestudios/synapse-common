'use strict';

var componentPath = '../../http/gateway';

jest.dontMock(componentPath);
jest.dontMock('../../lib/extendable');
jest.dontMock('underscore');

describe('http-gateway', function() {
    var HttpGateway = require(componentPath),
        httpGateway;

    beforeEach(function() {
        httpGateway = new HttpGateway();
    });

    describe('_toQuery', function() {
        it('converts a simple request data object into query string correctly', function() {
            var requestData = {
                one: 'foo',
                two: 'bar'
            };

            var expectedQueryString = 'one=foo&two=bar';

            expect(
                httpGateway._toQuery(requestData)
            ).toBe(expectedQueryString);
        });

        it('converts a request data object with an array into a query string correctly', function() {
            var requestData = {
                foo: [1, 2, 3]
            };

            var expectedQueryString = 'foo%5B%5D=1&foo%5B%5D=2&foo%5B%5D=3';

            expect(
                httpGateway._toQuery(requestData)
            ).toBe(expectedQueryString);
        });

        it('converts a request data object with nested objects into a query string correctly', function() {
            var requestData = {
                foo: {bar: 1, baz: 2}
            };

            var expectedQueryString = 'foo%5Bbar%5D=1&foo%5Bbaz%5D=2';

            expect(
                httpGateway._toQuery(requestData)
            ).toBe(expectedQueryString);
        });
    });
});
