"use strict";

// # Strand
//
// A strand provides a virtual address space for a series of pixels in an Open
// Pixel Control [1] strand.
//
// [1] http://openpixelcontrol.org/
//

var isInteger = require("is-integer");

function getBuffer(input) {
  if (Buffer.isBuffer(input)) {
    if (input.length % 3 !== 0) {
      throw new Error("Buffer length must be a multiple of 3");
    }
    return input;
  }
  else if (isInteger(input)) {
    return Buffer.alloc(input * 3);
  }
  else {
    throw new Error("Input must be a buffer or an integer length");
  }
}

module.exports = function(lengthOrBuffer) {
  function setPixel(index, r, g, b) {
    var offset = index * 3;
    this.buffer.writeUInt8(r, offset);
    this.buffer.writeUInt8(g, offset + 1);
    this.buffer.writeUInt8(b, offset + 2);
  }

  function getPixel(index) {
    var offset = index * 3;
    return [
      this.buffer.readUInt8(offset),
      this.buffer.readUInt8(offset + 1),
      this.buffer.readUInt8(offset + 2),
    ];
  }

  function slice(start, end) {
    return module.exports(this.buffer.slice(start * 3, end * 3));
  }

  // Get a buffer to use for the pixel data. The input can be either the
  // length of the strand or an existing buffer to use.
  var buffer = getBuffer(lengthOrBuffer);

  // Create an object where the properties are not configurable or
  // writable - e.g., strand.length cannot be assigned a new value.
  return Object.create(null, {
    buffer: {
      value: buffer,
      enumerable: true,
    },
    length: {
      value: buffer.length / 3,
      enumerable: true,
    },
    setPixel: {
      value: setPixel,
      enumerable: true,
    },
    getPixel: {
      value: getPixel,
      enumerable: true,
    },
    slice: {
      value: slice,
      enumerable: true,
    },
  });
};
