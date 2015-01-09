'use strict';

var getFakePromise = function(captured)
{
    return {
        then : function(then, fail) {
            captured.then = then;
            captured.fail = fail;

            return getFakePromise(captured);
        }
    };
};

module.exports = getFakePromise;

