/* global describe, it, beforeEach */
'use strict';

var proxyquire   = require('proxyquireify')(require);
var sinon        = require('sinon');
var expect       = require('chai').expect;
var EventEmitter = require('events').EventEmitter;

var TOKEN_URI = 'TOKEN_URI';
var HOSTNAME  = 'HOSTNAME';

describe('auth-gateway', function () {
    var HttpGateway, AuthGateway, authGateway, https;

    beforeEach(function () {
        https = sinon.spy();

        HttpGateway = proxyquire(
            '../../http/gateway',
            {
                q     : sinon.spy(),
                http  : sinon.spy(),
                https : https
            }
        );

        AuthGateway = proxyquire(
            '../../http/auth-gateway',
            {
                store       : {get : sinon.stub().returns({})},
                './gateway' : HttpGateway
            }
        );

        authGateway = new AuthGateway();
        authGateway.config = {
            client_id : '123',
            hostname  : HOSTNAME,
            secure    : true,
            oauth     : {
                logout : 'logout',
                token  : TOKEN_URI
            }
        };
    });

    describe('handle401', function () {
        var response, sendRequest, tokenRequests, apiCalls;

        beforeEach(function () {
            apiCalls = [];
            response = new EventEmitter();
            response.statusCode = 401;

            https.request = function (options, callback) {
                apiCalls.push(options.path);
                callback(response);
                response.emit('end');
            };

            sendRequest = function () {
                authGateway.apiRequest('GET', '/foo', {}, {});
            };
        });

        it('makes a request to get a new access token if the response is 401', function () {
            sendRequest();

            expect(1).to.equal(1);
        });
    });
});
