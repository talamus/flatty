function nativeStore(options) {
  if(!options) {
    options = {};
  }
  this.separator = options.separator || "\t";
  this.lineEnding = options.lineEnd || "\n";
}

nativeStore.prototype.init = function() {
  return "";
}

nativeStore.prototype.stringify = function(data, callback) {
  processed = "";
  for (var i in data) {
    processed += i + this.separator + JSON.stringify(data[i]) + this.lineEnding;
  }
  callback && callback(processed);
  return processed;
}

nativeStore.prototype.parse = function(data, callback) {
  parsed = {};
  splitted = data.toString().split(this.lineEnding);
  for (var i in splitted) {
    if (splitted[i] === '') {
      continue;
    }
    spl = splitted[i].substring(splitted[i].indexOf(this.separator) + 1);
    parsed[spl[0]] = JSON.parse(spl[1]);
    parsed[spl[0]].id = spl[0];
  }
  callback && callback(parsed);
  return parsed;
}

module.exports = nativeStore;