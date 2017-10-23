'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var EventEmitter = function EventEmitter() {
  this._listenerRegistry = {};
  this._eventBuffer = {};
  this._bufferRelease = {};
};

EventEmitter.prototype.on = function (event, listener) {
  if (typeof event !== 'string') {
    throw new Error('Parameter Error: event is required and has to be a string');
  }
  if (typeof listener !== 'function') {
    throw new Error('Parameter Error: listener is required and has to be a function');
  }

  if (!this._listenerRegistry.hasOwnProperty(event)) {
    this._listenerRegistry[event] = [];
  }
  this._listenerRegistry[event].push(listener);
};

EventEmitter.prototype.removeListener = function (event, listener) {
  var _this = this;

  if (typeof event !== 'string') {
    throw new Error('Parameter Error: event is required and has to be a string');
  }
  if (typeof listener !== 'function') {
    throw new Error('Parameter Error: listener is required and has to be a function');
  }

  this._listenerRegistry[event].forEach(function (listenerFn, listenerIndex) {
    if (listenerFn === listener) {
      _this._listenerRegistry[event].splice(listenerIndex, 1);
    }
  });
};

EventEmitter.prototype.emit = function (event) {
  for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    data[_key - 1] = arguments[_key];
  }

  if (!this._eventBuffer.hasOwnProperty(event)) {
    this._emitEvent.apply(this, [event].concat(data));
  } else {
    this._eventBuffer[event].push(data);
    if (this._bufferRelease[event]) {
      this._emitBuffer(event);
    }
  }
};

EventEmitter.prototype.startBuffering = function (event) {
  if (!this._eventBuffer.hasOwnProperty(event)) {
    this._eventBuffer[event] = [];
  }
  this._bufferRelease[event] = false;
};

EventEmitter.prototype.stopBuffering = function (event) {
  if (!this._eventBuffer.hasOwnProperty(event)) {
    return;
  }
  if (!this._bufferRelease[event]) {
    this._bufferRelease[event] = true;
    this._emitBuffer(event);
  }
};

EventEmitter.prototype._emitEvent = function (event) {
  for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    data[_key2 - 1] = arguments[_key2];
  }

  if (this._listenerRegistry.hasOwnProperty(event)) {
    this._listenerRegistry[event].forEach(function (listener) {
      return listener.apply(undefined, data);
    });
  }
};

EventEmitter.prototype._emitBuffer = function (event) {
  if (!this._eventBuffer.hasOwnProperty(event)) {
    return;
  }
  while (this._eventBuffer[event].length > 0) {
    this._emitEvent.apply(this, [event].concat(_toConsumableArray(this._eventBuffer[event].splice(0, 1)[0])));
  }
};

module.exports = EventEmitter;