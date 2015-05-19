/* global describe, it, beforeEach */
/* jshint -W024 */ // Ignore reserved word errors
/* jshint expr: true */
'use strict';

var expect = require('chai').expect;

var MatchMedia = require('../../store/match-media');

describe('MatchMediaStore', function() {
    describe('getMatches', function() {
        it('returns an object of boolean values', function() {
            var store = new MatchMedia({
                queries : {
                    maxWidth : '(max-width: 1px)',
                    minWidth : '(min-width: 1px)'
                },
                default : 'minWidth'
            });

            var matches = store.getMatches();

            expect(matches).to.be.an('object');
            expect(matches.maxWidth).to.be.false;
            expect(matches.minWidth).to.be.true;
        });
    });

    describe('default query', function() {
        before(function () {
            window.oldMatchMedia = window.matchMedia;
            window.matchMedia    = undefined;
        });

        after(function () {
            window.matchMedia = window.oldMatchMedia;
        });

        it('used when window.matchMedia not present', function() {
            var store = new MatchMedia({
                queries : {
                    maxWidth : '(max-width: 1px)',
                    minWidth : '(min-width: 1px)'
                },
                default : 'maxWidth'
            });

            var matches = store.getMatches();

            expect(matches.maxWidth).to.be.true;
            expect(matches.minWidth).to.be.false;
        });
    });

    describe('backwards compatibility', function() {
        it('accepts the pre 1.5.0 format', function() {
            var store = new MatchMedia({
                maxWidth : '(max-width: 1px)',
                minWidth : '(min-width: 1px)'
            });

            var matches = store.getMatches();

            expect(matches.maxWidth).to.be.false;
            expect(matches.minWidth).to.be.true;
        });
    });
});
