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
        var response, failWith401, sendRequest, tokenRequests, apiCalls, tokenExchangeRequests;

        beforeEach(function () {
            apiCalls    = [];
            response    = new EventEmitter();
            failWith401 = true;

            https.request = function (options, callback) {
                apiCalls.push(options.path);

                response.statusCode = (options.path === TOKEN_URI) ?
                    200 :
                    (failWith401 ? 401 : 200);
                callback(response);

                if (options.path !== TOKEN_URI) {
                    response.emit('end');
                }
            };

            sendRequest = function () {
                authGateway.apiRequest('GET', '/foo', {}, {});
            };

            tokenExchangeRequests = function () {
                return apiCalls.filter(function (path) {
                    return path === TOKEN_URI;
                }).length;
            };
        });

        it('makes a request to get a new access token if the response is 401', function () {
            sendRequest();

            expect(tokenExchangeRequests()).to.equal(1);
        });

        it('does not make multiple token refresh requests if multiple parallel responses return 401', function () {
            sendRequest();
            sendRequest();
            sendRequest();
            sendRequest();

            expect(tokenExchangeRequests()).to.equal(1);
        });

        it('refreshes token every time a request returns 401 if not currently refreshing the token', function () {
            sendRequest();

            failWith401 = false;
            sendRequest();
            sendRequest();

            failWith401 = true;
            sendRequest();

            expect(tokenExchangeRequests()).to.equal(3);
        });
    });
});
