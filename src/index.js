'use strict';

const EventEmitter = function() {
  this._listenerRegistry = {};
  this._eventBuffer = {};
  this._bufferRelease = {};
};

EventEmitter.prototype.on = function(event, listener) {
  if (typeof event !== 'string') {
    throw new Error(`Parameter Error: event is required and has to be a string`);
  }
  if (typeof listener !== 'function') {
    throw new Error(`Parameter Error: listener is required and has to be a function`);
  }

  if (!this._listenerRegistry.hasOwnProperty(event)) {
    this._listenerRegistry[event] = [];
  }
  this._listenerRegistry[event].push(listener);
};

EventEmitter.prototype.removeListener = function(event, listener) {
  if (typeof event !== 'string') {
    throw new Error(`Parameter Error: event is required and has to be a string`);
  }
  if (typeof listener !== 'function') {
    throw new Error(`Parameter Error: listener is required and has to be a function`);
  }

  this._listenerRegistry[event].forEach((listenerFn, listenerIndex) => {
    if (listenerFn === listener) {
      this._listenerRegistry[event].splice(listenerIndex, 1);
    }
  });
};

EventEmitter.prototype.emit = function(event, ...data) {
  if (!this._eventBuffer.hasOwnProperty(event)) {
    this._emitEvent(event, ...data);
  } else {
    this._eventBuffer[event].push(data);
    if (this._bufferRelease[event]) {
      this._emitBuffer(event);
    }
  }
};

EventEmitter.prototype.startBuffering = function(event) {
  if (!this._eventBuffer.hasOwnProperty(event)) {
    this._eventBuffer[event] = [];
  }
  this._bufferRelease[event] = false;
};

EventEmitter.prototype.stopBuffering = function(event) {
  if (!this._eventBuffer.hasOwnProperty(event)) {
    return;
  }
  if (!this._bufferRelease[event]) {
    this._bufferRelease[event] = true;
    this._emitBuffer(event);
  }
};

EventEmitter.prototype._emitEvent = function(event, ...data) {
  if (this._listenerRegistry.hasOwnProperty(event)) {
    this._listenerRegistry[event].forEach(listener => listener(...data)); // eslint-disable-line arrow-body-style
  }
};

EventEmitter.prototype._emitBuffer = function(event) {
  if (!this._eventBuffer.hasOwnProperty(event)) {
    return;
  }
  while (this._eventBuffer[event].length > 0) {
    this._emitEvent(event, ...this._eventBuffer[event].splice(0, 1)[0]);
  }
};

module.exports = EventEmitter;
