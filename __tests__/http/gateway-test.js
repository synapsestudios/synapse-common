/* global describe, it, beforeEach */
/* jshint expr: true */
'use strict';

var proxyquire = require('proxyquireify')(require);
var sinon      = require('sinon');
var expect     = require('chai').expect;

describe('http-gateway', function() {
    var HttpGateway, httpGateway;

    beforeEach(function() {
        HttpGateway = proxyquire(
            '../../http/gateway',
            {
                'q'       : sinon.spy(),
                'http'    : sinon.spy(),
                'https'   : sinon.spy()
            }
        );

        httpGateway = new HttpGateway();
    });

    describe('toQuery', function() {
        it('converts a simple request data object into query string correctly', function() {
            var requestData = {
                one: 'foo',
                two: 'bar'
            };

            var expectedQueryString = 'one=foo&two=bar';

            expect(httpGateway.toQuery(requestData)).to.equal(expectedQueryString);
        });

        it('converts a request data object with an array into a query string correctly', function() {
            var requestData = {
                foo: [1, 2, 3]
            };

            var expectedQueryString = 'foo%5B%5D=1&foo%5B%5D=2&foo%5B%5D=3';

            expect(httpGateway.toQuery(requestData)).to.equal(expectedQueryString);
        });

        it('converts a request data object with nested objects into a query string correctly', function() {
            var requestData = {
                foo: {bar: 1, baz: 2}
            };

            var expectedQueryString = 'foo%5Bbar%5D=1&foo%5Bbaz%5D=2';

            expect(httpGateway.toQuery(requestData)).to.equal(expectedQueryString);
        });
    });
});
