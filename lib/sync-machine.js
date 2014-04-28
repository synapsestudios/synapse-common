/**
 * Adapted from ChaplinJS (http://chaplinjs.org/)
 */

'use strict';

var event, handlerFn;

var UNSYNCED = 'unsynced',
    SYNCING = 'syncing',
    SYNCED = 'synced',
    STATE_CHANGE = 'syncStateChange';

var SyncMachine = {

    _syncState         : UNSYNCED,
    _previousSyncState : null,

    syncState: function() {
        return this._syncState;
    },

    isUnsynced: function() {
        return this._syncState === UNSYNCED;
    },

    isSynced: function() {
        return this._syncState === SYNCED;
    },

    isSyncing: function() {
        return this._syncState === SYNCING;
    },

    unsync: function() {
        var state;

        if ((state = this._syncState) === SYNCING || state === SYNCED) {
            this._previousSync = this._syncState;
            this._syncState    = UNSYNCED;

            this.trigger(this._syncState, this, this._syncState);
            this.trigger(STATE_CHANGE, this, this._syncState);
        }
    },
    beginSync: function() {
        var state;

        if ((state = this._syncState) === UNSYNCED || state === SYNCED) {
            this._previousSync = this._syncState;
            this._syncState    = SYNCING;

            this.trigger(this._syncState, this, this._syncState);
            this.trigger(STATE_CHANGE, this, this._syncState);
        }
    },
    finishSync: function() {
        if (this._syncState === SYNCING) {
            this._previousSync = this._syncState;
            this._syncState    = SYNCED;

            this.trigger(this._syncState, this, this._syncState);
            this.trigger(STATE_CHANGE, this, this._syncState);
        }
    },
    abortSync: function() {
        if (this._syncState === SYNCING) {
            this._syncState    = this._previousSync;
            this._previousSync = this._syncState;

            this.trigger(this._syncState, this, this._syncState);
            this.trigger(STATE_CHANGE, this, this._syncState);
        }
    }
};

var states = [UNSYNCED, SYNCING, SYNCED, STATE_CHANGE];

handlerFn = function(event) {
    return SyncMachine[event] = function(callback, context) {
        if (context == null) {
            context = this;
        }

        this.on(event, callback, context);

        if (this._syncState === event) {
            return callback.call(context);
        }
    };
};

for (var i = 0, len = states.length; i < len; i+=1) {
    event = states[i];
    handlerFn(event);
}

if (typeof Object.freeze === "function") {
    Object.freeze(SyncMachine);
}

module.exports = SyncMachine;