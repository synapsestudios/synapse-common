'use strict';

var _ = require('underscore');
var mediator = require('./mediator');

var queryParams = {
    stringify: function(queryParams) {
        var arrParam, encodedKey, key, query, stringifyKeyValuePair, value, _i, _len;
        query = '';
        stringifyKeyValuePair = function(encodedKey, value) {
            if (value != null) {
                return '&' + encodedKey + '=' + encodeURIComponent(value);
            } else {
                return '';
            }
        };
        for (key in queryParams) {
            if (!__hasProp.call(queryParams, key)) continue;
            value = queryParams[key];
            encodedKey = encodeURIComponent(key);
            if (_.isArray(value)) {
                for (_i = 0, _len = value.length; _i < _len; _i+=1) {
                    arrParam = value[_i];
                    query += stringifyKeyValuePair(encodedKey, arrParam);
                }
            } else {
                query += stringifyKeyValuePair(encodedKey, value);
            }
        }
        return query && query.substring(1);
    },
    parse: function(queryString) {
        var current, field, pair, pairs, params, value, _i, _len, _ref;
        params = {};
        if (!queryString) {
            return params;
        }
        pairs = queryString.split('&');
        for (_i = 0, _len = pairs.length; _i < _len; _i+=1) {
            pair = pairs[_i];
            if (!pair.length) {
                continue;
            }
            _ref  = pair.split('=');
            field = _ref[0];
            value = _ref[1];
            if (!field.length) {
                continue;
            }
            field = decodeURIComponent(field);
            value = decodeURIComponent(value);
            current = params[field];
            if (current) {
                if (current.push) {
                    current.push(value);
                } else {
                    params[field] = [current, value];
                }
            } else {
                params[field] = value;
            }
        }
        return params;
    }
};

var escapeRegExp   = /[\-{}\[\]+?.,\\\^$|#\s]/g,
    optionalRegExp = /\((.*?)\)/g,
    paramRegExp    = /(?::|\*)(\w+)/g;

var processTrailingSlash = function(path, trailing)
{
    switch (trailing)
    {
        case true:
            if (path.slice(-1) !== '/')
            {
                path += '/';
            }
            break;
        case false:
            if (path.slice(-1) === '/')
            {
                path = path.slice(0, -1);
            }
            break;
    }

    return path;
};

var stringify = function(queryParams) {
    var arrParam, encodedKey, key, value, i,
        query = '';

    var stringifyKeyValuePair = function(encodedKey, value)
    {
        if (value != null)
        {
            return '&' + encodedKey + '=' + encodeURIComponent(value);
        }
        else
        {
            return '';
        }
    };

    for (key in queryParams)
    {
        if ( ! Object.hasOwnProperty.call(queryParams, key))
            continue;

        value      = queryParams[key];
        encodedKey = encodeURIComponent(key);

        if (_.isArray(value))
        {
            for (i = 0; i < value.length; i+=1)
            {
                arrParam = value[i];
                query   += stringifyKeyValuePair(encodedKey, arrParam);
            }
        }
        else
        {
            query += stringifyKeyValuePair(encodedKey, value);
        }
    }

    return query && query.substring(1);
};

function Route(pattern, target, options) {
    var _ref;
    this.pattern = pattern;
    this.target  = target;

    this.handler              = _.bind(this.handler, this);
    this.replaceParams        = _.bind(this.replaceParams, this);
    this.parseOptionalPortion = _.bind(this.parseOptionalPortion, this);

    if (typeof this.pattern !== 'string')
    {
        throw new Error('Route: RegExps are not supported. Use strings with :names and `constraints` option of route');
    }

    this.options = options ? _.extend({}, options) : {};

    if (this.options.name != null)
    {
        this.name = this.options.name;
    }

    if (this.name && this.name.indexOf('#') !== -1)
    {
        throw new Error('Route: "#" cannot be used in name');
    }

    if ((_ref = this.name) == null)
    {
        throw new Error('Route: all routes must have names');
    }

    this.allParams      = [];
    this.requiredParams = [];
    this.optionalParams = [];

    this.createRegExp();

    if (typeof Object.freeze === "function")
    {
        Object.freeze(this);
    }
}

Route.prototype.matches = function(criteria)
{
    if (typeof criteria === 'string')
    {
        return criteria === this.name;
    }
    else
    {
        return false;
    }
};

Route.prototype.reverse = function(params, query)
{
    var name, queryString, raw, value, i, j;

    params = this.normalizeParams(params);

    if (params === false)
    {
        return false;
    }

    var url      = this.pattern,
        required = this.requiredParams,
        optional = this.optionalParams;

    // fill required params
    for (i = 0; i < required.length; i+=1)
    {
        name  = required[i];
        value = params[name];
        url   = url.replace(RegExp("[:*]" + name, "g"), value);
    }

    // fill optional params
    for (j = 0; j < optional.length; j+=1)
    {
        name = optional[j];

        if (value = params[name])
        {
            url = url.replace(RegExp("[:*]" + name, "g"), value);
        }
    }

    // remove unfulfilled optional params
    raw = url.replace(optionalRegExp, function(match, portion)
    {
        if (portion.match(/[:*]/g)) {
            return "";
        } else {
            return portion;
        }
    });

    // add/remove the trailing slash
    url = processTrailingSlash(raw, this.options.trailing);

    // stringify query params if necessary
    if ( ! query)
    {
        return url;
    }

    if (typeof query === 'object')
    {
        queryString = stringify(query);
        return url += queryString ? '?' + queryString : '';
    }
    else
    {
        return url += (query[0] === '?' ? '' : '?') + query;
    }
};

Route.prototype.normalizeParams = function(params)
{
    var paramIndex, paramName, paramsHash, _i, _len, _ref;

    if (_.isArray(params))
    {
        if (params.length < this.requiredParams.length)
        {
            return false;
        }

        paramsHash = {};
        _ref       = this.requiredParams;

        for (paramIndex = _i = 0, _len = _ref.length; _i < _len; paramIndex = ++_i)
        {
            paramName = _ref[paramIndex];
            paramsHash[paramName] = params[paramIndex];
        }

        if ( ! this.testConstraints(paramsHash))
        {
            return false;
        }

        params = paramsHash;

    }
    else
    {
        if (params == null)
        {
            params = {};
        }

        if ( ! this.testParams(params))
        {
            return false;
        }
    }
    return params;
};

Route.prototype.testConstraints = function(params) {
    var constraint, constraints, name;
    constraints = this.options.constraints;
    if (constraints) {
        for (name in constraints) {
            if (!Object.hasOwnProperty.call(constraints, name)) continue;
            constraint = constraints[name];
            if (!constraint.test(params[name])) {
                return false;
            }
        }
    }
    return true;
};

Route.prototype.testParams = function(params) {
    var paramName, _i, _len, _ref;
    _ref = this.requiredParams;
    for (_i = 0, _len = _ref.length; _i < _len; _i+=1) {
        paramName = _ref[_i];
        if (params[paramName] === void 0) {
            return false;
        }
    }
    return this.testConstraints(params);
};

Route.prototype.createRegExp = function() {
    var pattern,
        _this = this;
    pattern = this.pattern;
    pattern = pattern.replace(escapeRegExp, '\\$&');
    this.replaceParams(pattern, function(match, param) {
        return _this.allParams.push(param);
    });
    pattern = pattern.replace(optionalRegExp, this.parseOptionalPortion);
    pattern = this.replaceParams(pattern, function(match, param) {
        _this.requiredParams.push(param);
        return _this.paramCapturePattern(match);
    });
    return this.regExp = RegExp("^" + pattern + "(?=\\/?(?=\\?|$))");
};

Route.prototype.parseOptionalPortion = function(match, optionalPortion) {
    var portion,
        _this = this;
    portion = this.replaceParams(optionalPortion, function(match, param) {
        _this.optionalParams.push(param);
        return _this.paramCapturePattern(match);
    });
    return "(?:" + portion + ")?";
};

Route.prototype.replaceParams = function(s, callback) {
    return s.replace(paramRegExp, callback);
};

Route.prototype.paramCapturePattern = function(param) {
    if (param.charAt(0) === ':') {
        return '([^\/\?]+)';
    } else {
        return '(.*?)';
    }
};

Route.prototype.test = function(path) {
    var constraints, matched;
    matched = this.regExp.test(path);
    if ( ! matched) {
        return false;
    }
    constraints = this.options.constraints;
    if (constraints) {
        return this.testConstraints(this.extractParams(path));
    }
    return true;
};

Route.prototype.handler = function(pathParams, options) {
    var actionParams, params, path, query, route, _ref;
    options = options ? _.extend({}, options) : {};
    if (typeof pathParams === 'object') {
        query = queryParams.stringify(options.query);
        params = pathParams;
        path = this.reverse(params);
    } else {
        _ref = pathParams.split('?'), path = _ref[0], query = _ref[1];
        if (!(query != null)) {
            query = '';
        } else {
            options.query = queryParams.parse(query);
        }
        params = this.extractParams(path);
        path = processTrailingSlash(path, this.options.trailing);
    }
    actionParams = _.extend({}, params, this.options.params);
    route = {
        path   : path,
        target : this.target,
        name   : this.name,
        query  : query
    };

    if (this.options.useMediator !== false) {
        return mediator.publish('router:match', route, actionParams, this.options);
    } else {
        return [route, actionParams, this.options];
    }
};

Route.prototype.extractParams = function(path) {
    var index, match, matches, paramName, params, _i, _len, _ref;
    params = {};
    matches = this.regExp.exec(path);
    _ref = matches.slice(1);
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        match = _ref[index];
        paramName = this.allParams.length ? this.allParams[index] : index;
        params[paramName] = match;
    }
    return params;
};

module.exports = Route;
