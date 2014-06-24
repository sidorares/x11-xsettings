function decode(buf) {
  var offset = 0;
  var endian = buf[0];
  var readByte = function() {
    return buf[offset++];
  };
  var readInt = function() {
    var res;
    if (endian)
      res = buf.readUInt32BE(offset);
    else
      res = buf.readUInt32LE(offset);
    offset += 4;
    return res;
  };

  var pad4 = function(len) {
    return ((len + 3) >> 2) << 2;
  };

  var readShort = function() {
    var res;
    if (endian)
      res = buf.readUInt16BE(offset);
    else
      res = buf.readUInt16LE(offset);
    offset += 2;
    return res;
  };

  var readString = function(len) {
    var pad = pad4(len);
    var str = buf.toString('utf8', offset, offset + len);
    offset += pad;
    return str;
  };

  var readValue = [
    function() { // int
      return readInt();
    },
    function () { // string
      return readString(readInt());
    },
    function() { // color
      var res = {};
      res.red   = readShort();
      res.blue  = readShort();
      res.green = readShort();
      var alpha = readShort();
      if (alpha != 65535)
        res.alpha = alpha;
      return res;
    }
  ];

  offset = 4;
  var serial = readInt();
  var nkeys  = readInt();
  var settings = {};
  for (var i=0; i < nkeys; ++i) {
    setting = {};
    setting.type = readByte();
    readByte(); // unused
    var name = readString(readShort());
    setting.serial = readInt();
    setting.value  = readValue[setting.type]();
    settings[name] = setting;
  }
  return settings;
}

function encode(settings) {
  // TODO
}

module.exports.encode = encode;
module.exports.decode = decode;
