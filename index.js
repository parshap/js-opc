"use strict";

// # Stream
//
// A stream that emits Open Pixel Control protocol messages.
//

var util = require('util');
var PassThrough = require('stream').PassThrough;

function OPCStream() {
  PassThrough.call(this);
}

util.inherits(OPCStream, PassThrough);

OPCStream.prototype.writeMessage = function(channel, command, data) {
  return this.write(createMessage(channel, command, data));
};

OPCStream.prototype.writePixels = function(channel, pixels) {
  return this.write(createPixelsMessage(channel, pixels));
};

OPCStream.prototype.writeColorCorrection = function(config) {
  return this.write(createSetGlobalColorCorrectionMessage(config));
};

function createPixelsMessage(channel, pixels) {
  return createMessage(channel, 0, pixels);
}

function createSetGlobalColorCorrectionMessage(config) {
  var json = JSON.stringify(config);
  var data = new Buffer(Buffer.byteLength(json) + 4);
  data.writeUInt16BE(0x0001, 0); // System ID ("Fadecandy")
  data.writeUInt16BE(0x0001, 2); // SysEx ID ("Set Global Color Correction")
  data.write(json, 4); // data
  return createMessage(0, 0xff, data);
}

function createMessage(channel, command, data) {
  var control = createControl(channel, command, data.length);
  return Buffer.concat([control, data]);
}

function createControl(channel, command, length) {
  var CONTROL_LENGTH = 4;
  var buffer = new Buffer(CONTROL_LENGTH);
  buffer.writeUInt8(channel, 0); // Channel
  buffer.writeUInt8(command, 1); // Command
  buffer.writeUInt16BE(length, 2); // Data length
  return buffer;
}

// @TODO Set Firmware Configuration

// ## Exports
//
// Factory for OPCStream
//

module.exports = function(size) {
  return new OPCStream(size);
};
