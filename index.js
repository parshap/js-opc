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

OPCStream.prototype.writePixels = function(channel, pixels) {
  return this.write(createPixelsPacket(channel, pixels));
};

OPCStream.prototype.writeColorCorrection = function(config) {
  return this.write(createSetGlobalColorCorrectionPacket(config));
};

function createPixelsPacket(channel, pixels) {
  var control = createPixelsControlPacket(channel, pixels);
  return Buffer.concat([control, pixels]);
}

function createPixelsControlPacket(channel, pixels) {
  var CONTROL_LENGTH = 4;
  var buffer = new Buffer(CONTROL_LENGTH);
  buffer.writeUInt8(0, 0); // Channel
  buffer.writeUInt8(0, 1); // Command
  buffer.writeUInt16BE(pixels.length, 2); // Data length
  return buffer;
}

function createSetGlobalColorCorrectionPacket(config) {
  var CONTROL_LENGTH = 8;
  var json = JSON.stringify(config);
  var dataLength = json.length;
  var bufferLength = CONTROL_LENGTH + dataLength;
  var buffer = new Buffer(bufferLength);
  buffer.writeUInt8(0, 0); // Channel
  buffer.writeUInt8(0xff, 1); // Command
  buffer.writeUInt16BE(dataLength, 2); // Data length
  buffer.writeUInt16BE(0x0001, 4); // System ID ("Fadecandy")
  buffer.writeUInt16BE(0x0001, 6); // SysEx ID ("Set Global Color Correction")
  buffer.write(json, 8); // data
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
