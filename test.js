"use strict";

var assert = require("assert");
var createStrand = require("./strand");

var strand = createStrand(10);
strand.setPixel(0, 5, 10, 15);
assert.equal(strand.buffer.readUInt8(0), 5);
assert.equal(strand.buffer.readUInt8(1), 10);
assert.equal(strand.buffer.readUInt8(2), 15);
strand.slice(2, 6).setPixel(3, 1, 2, 3);
assert.equal(strand.buffer.readUInt8((5 * 3) + 0), 1);
assert.equal(strand.buffer.readUInt8((5 * 3) + 1), 2);
assert.equal(strand.buffer.readUInt8((5 * 3) + 2), 3);
