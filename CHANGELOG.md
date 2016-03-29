## [v.1.9.5](https://github.com/synapsestudios/synapse-common/compare/v1.9.4...v1.9.5) - 2016-01-05 
### Fixed
- [#60](https://github.com/synapsestudios/synapse-common/pull/60)  Replace underscore references with equivalent lodash references.


## [v.1.9.4](https://github.com/synapsestudios/synapse-common/compare/v1.9.3...v1.9.4) - 2015-11-24 
### Fixed
- [#59](https://github.com/synapsestudios/synapse-common/pull/59)  Tokens aren't refreshing correctly.


## [v.1.9.3](https://github.com/synapsestudios/synapse-common/compare/v1.9.1...v1.9.3) - 2015-11-19
### Changed
- [#57](https://github.com/synapsestudios/synapse-common/pull/57)  Replace Underscore with Lodash.

### Fixed
- [#58](https://github.com/synapsestudios/synapse-common/pull/58)  Error when AuthGateway tries to handle 401 response without Authorization request header.


## [v.1.9.1](https://github.com/synapsestudios/synapse-common/compare/v1.9.0...v1.9.1) - 2015-09-01
### Changed
- [#55](https://github.com/synapsestudios/synapse-common/pull/55)  Swap store with store2.
- [#56](https://github.com/synapsestudios/synapse-common/pull/56)  Update auth-gateway.js.


## [v.1.9.0](https://github.com/synapsestudios/synapse-common/compare/v1.8.3...v1.9.0) - 2015-08-21


## [v.1.8.3](https://github.com/synapsestudios/synapse-common/compare/v1.8.2...v1.8.3) - 2015-08-11
### Added
- [#54](https://github.com/synapsestudios/synapse-common/pull/54)  Blob data can be uploaded through the http gateway.


## [v.1.8.2](https://github.com/synapsestudios/synapse-common/compare/v1.8.1...v1.8.2) - 2015-07-15
### Fixed
- Fix issue where only the first request was being retried after refreshing an auth token


## [v.1.8.1](https://github.com/synapsestudios/synapse-common/compare/v1.8.0...v1.8.1) - 2015-06-09
### Fixed
- Fix oauth token refresh issue


## [v.1.8.0](https://github.com/synapsestudios/synapse-common/compare/v1.7.1...v1.8.0) - 2015-06-09
### Feature Updates
- Added index file for easy `require`-ing of modules. e.g. `require('synapse-common').AuthGateway` instead of `require('synapse-common/http/auth-gateway')`


## [v.1.7.1](https://github.com/synapsestudios/synapse-common/compare/v1.7.0...v1.7.1) - 2015-06-04
### Fixed
- Various oauth token refresh issues


## [v.1.7.0](https://github.com/synapsestudios/synapse-common/compare/v1.6.0...v1.7.0) - 2015-06-01
### Feature Updates
- Added support for file upload progress

### Refactors
- Refactored gateway and auth-gateway to be more extensible


## [v1.6.0](https://github.com/synapsestudios/synapse-common/compare/v1.5.1...v1.6.0) - 2015-05-26
### Feature Updates
- [#42](https://github.com/synapsestudios/synapse-common/pull/42) Avoid sending parallel token refresh requests; instead, just defer re-sending multiple 401'd requests until the original token refresh request is finished


## [v1.5.1](https://github.com/synapsestudios/synapse-common/compare/v1.5.0...v1.5.1) - 2015-05-19
### Fixed
- [#44](https://github.com/synapsestudios/synapse-common/pull/44) Match media store doesn't overwrite itself


## [v1.5.0](https://github.com/synapsestudios/synapse-common/compare/v1.4.1...v1.5.0) - 2015-05-19
### Feature Updates
 - [#43](https://github.com/synapsestudios/synapse-common/pull/43) MatchMediaStore can be rendered server-side


## [v1.4.1](https://github.com/synapsestudios/synapse-common/compare/v1.4.0...v1.4.1) - 2015-04-23
### Feature Updates
- [#41](https://github.com/synapsestudios/synapse-common/pull/41) Updated gateways (auth and regular) to support uploads


## [v1.4.0](https://github.com/synapsestudios/synapse-common/compare/v1.3.1...v1.4.0) - 2015-04-10
### Fixed
- [#40] (https://github.com/synapsestudios/synapse-common/pull/40) Extra configuration for API prefix and token/login endpoints


## [v1.2.1](https://github.com/synapsestudios/synapse-common/compare/v1.2.0...v1.2.1) - 2015-03-23
### Fixed
- [#37](https://github.com/synapsestudios/synapse-common/pull/37) Auth gateway fails to set token after 401 response


## [v1.2.0](https://github.com/synapsestudios/synapse-common/compare/v1.1.0...v1.2.0) - 2015-02-17
### Feature Updates
- [#34](https://github.com/synapsestudios/synapse-common/pull/34) Add explicit dependency upon store.
- [#36](https://github.com/synapsestudios/synapse-common/pull/36) Handle refresh token exchange failure by redirecting to homepage or location in config.


## [v1.1.0](https://github.com/synapsestudios/synapse-common/compare/v1.0.0...v1.1.0) - 2015-02-17
### Feature Updates
- [#32](https://github.com/synapsestudios/synapse-common/pull/32) Extract localStorage key and `Authorization` header prefixes into to separate properties in `auth-gateway`.

## [v1.0.0](https://github.com/synapsestudios/synapse-common/compare/v0.3.0...v1.0.0) - 2015-02-05
### Updates
- [#14](https://github.com/synapsestudios/synapse-common/pull/14) Make Underscore and Q explicit dependencies.

### Breaking Changes
- [#20](https://github.com/synapsestudios/synapse-common/pull/20) Remove non-fluxxor stores and Events/SEO mixins.
- [#22](https://github.com/synapsestudios/synapse-common/pull/22) Remove StoreWatch mixin.
- [#28](https://github.com/synapsestudios/synapse-common/pull/28) Change `test-helpers` directory to `test-helper`.

## [v0.3.0](https://github.com/synapsestudios/synapse-common/compare/v0.2.0...v0.3.0) - 2015-01-21
### Feature Updates
- [#29](https://github.com/synapsestudios/synapse-common/pull/29) Exchange refresh token for new access token on 401 in auth gateway.

## [v0.2.0](https://github.com/synapsestudios/synapse-common/compare/v0.1.2...v0.2.0) - 2014-12-09
### Feature Updates
- [#17](https://github.com/synapsestudios/synapse-common/pull/17) Allow gateway and auth-gateway to use https.
- [#19](https://github.com/synapsestudios/synapse-common/pull/19) HTTP gateway now supports overridden headers.
- [#23](https://github.com/synapsestudios/synapse-common/pull/23) Convert Jest tests to Karma/Mocha/Chai/Sinon/Proxyquireify.
- [#24](https://github.com/synapsestudios/synapse-common/pull/24) Move test helpers to the test-helpers directory.
- [#26](https://github.com/synapsestudios/synapse-common/pull/26) Remove the peer dependency react version from package.json.


## [v0.1.2](https://github.com/synapsestudios/synapse-common/compare/v0.1.1...v0.1.2) - 2014-10-01
### Feature Updates
- [#15](https://github.com/synapsestudios/synapse-common/pull/15) / [#16](https://github.com/synapsestudios/synapse-common/pull/16) Update test-data-provider to work with Mocha.


## [v0.1.1](https://github.com/synapsestudios/synapse-common/compare/v0.1.0...v0.1.1) - 2014-08-28
### Feature Updates
- [#11](https://github.com/synapsestudios/synapse-common/pull/11) Emit '401-response-received' event on the dispatcher on 401 response in http/auth-gateway.
- [#13](https://github.com/synapsestudios/synapse-common/pull/13) Pass 'withCredentials' option in to httpRequest.


## [v0.1.0](https://github.com/synapsestudios/synapse-common/releases/tag/v0.1.0) - 2014-07-25
- Initial version.
