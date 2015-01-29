"use strict";

var through = require("through2");
var parse = require("parse-binary-stream");
var duplexer = require("duplexer2");

function parseMessage(read, callback) {
  var message = {};
  // read channel
  read(1, function(data) {
    message.channel = data.readUInt8(0);
    // read command
    read(1, function(data) {
      message.command = data.readUInt8(0);
      // read data length
      read(2, function(data) {
        var length = data.readUInt16BE(0);
        // read data
        read(length, function(data) {
          message.data = data;
          // done!
          callback(message);
        });
      });
    });
  });
}

function parseAllMessages(read, callback) {
  (function next() {
    parseMessage(read, function(message) {
      callback(message);
      next();
    });
  })();
}

module.exports = function() {
  var parser = parse(function(read) {
    parseAllMessages(read, function(message) {
      output.push(message);
    });
  });
  var output = through.obj();
  parser.on("end", function() {
    output.push(null);
  });
  return duplexer(parser, output);
};
