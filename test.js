"use strict";

var test = require("tape");
var concat = require("concat-stream");
var bufferEqual = require("buffer-equal");

test("opc", function(t) {
  // Strand
  var createStrand = require("./strand");
  var strand = createStrand(10);
  strand.setPixel(0, 5, 10, 15);
  t.deepEqual(strand.getPixel(0), [5, 10, 15]);
  t.equal(strand.buffer.readUInt8(0), 5);
  t.equal(strand.buffer.readUInt8(1), 10);
  t.equal(strand.buffer.readUInt8(2), 15);
  strand.slice(2, 6).setPixel(3, 1, 2, 3);
  t.deepEqual(strand.slice(2 + 3, 2 + 3 + 1).getPixel(0), [1, 2, 3]);
  t.equal(strand.buffer.readUInt8((5 * 3) + 0), 1);
  t.equal(strand.buffer.readUInt8((5 * 3) + 1), 2);
  t.equal(strand.buffer.readUInt8((5 * 3) + 2), 3);

  // Stream
  var createStream = require("./index");
  var stream = createStream();
  stream.writePixels(0, strand.buffer);
  stream.writeMessage(5, 10, Buffer.from([0x0, 0x1, 0x2]));
  stream.end();
  stream.pipe(concat(function(data) {
    // .writePixels(0, strand.buffer);
    t.equal(data.readUInt8(0), 0);
    t.equal(data.readUInt8(1), 0);
    t.equal(data.readUInt16BE(2), strand.buffer.length);
    t.ok(bufferEqual(data.slice(4, 4 + strand.buffer.length), strand.buffer));

    // .writeMessage(5, 10, Buffer.from([0x0, 0x1, 0x2]));
    var offset = strand.buffer.length + 4;
    t.equal(data.readUInt8(offset + 0), 5);
    t.equal(data.readUInt8(offset + 1), 10);
    t.equal(data.readUInt16BE(offset + 2), 3);
    t.ok(bufferEqual(data.slice(offset + 4), Buffer.from([0x0, 0x1, 0x2])));
  }));

  // @TODO Test stream.writeColorCorrection

  // Parser
  var parserAsserters = [
    function(message) {
      t.equal(message.channel, 0);
      t.equal(message.command, 0);
      t.ok(bufferEqual(message.data, strand.buffer));
    },
    function(message) {
      t.equal(message.channel, 1);
      t.equal(message.command, 0);
      t.ok(bufferEqual(message.data, strand.buffer));
    },
  ];
  var createParser = require("./parser");
  var parserIndex = 0;
  var parser = createParser().on("data", function(message) {
    parserAsserters[parserIndex](message);
    parserIndex += 1;
  });
  var stream2 = createStream();
  stream2.pipe(parser);
  stream2.writePixels(0, strand.buffer);
  stream2.writePixels(1, strand.buffer);
  stream2.end();
  parser.on("end", function() {
    t.equal(parserIndex, 2);
    t.end();
  });
});
