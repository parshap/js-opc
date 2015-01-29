"use strict";

// # Strand
//
// A strand provides a virtual address space for a series of pixels in an Open
// Pixel Control [1] strand.
//
// [1] http://openpixelcontrol.org/
//

module.exports = function(length, buffer) {
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
    return module.exports(end - start, this.buffer.slice(start * 3, end * 3));
  }

  if (length === undefined) {
    throw new Error("Strand length must be given");
  }

  return Object.create(null, {
    buffer: {
      value: buffer || new Buffer(length * 3),
      enumerable: true,
    },
    length: {
      value: length,
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
      value: slice
    },
  });
};
