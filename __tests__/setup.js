'use strict';
// Ensure that chai accepts should-style assertions and is integrated with sinon.
var chai      = require('chai');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);
