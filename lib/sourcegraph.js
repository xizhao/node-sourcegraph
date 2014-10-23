var https = require('https');

var api_resources = {};

function registerMethod(resource, method_name, url_path, pre, type) {
  if(!api_resources[resource]) api_resources[resource] = {};
  api_resources[resource][method_name] = function() {
    var cb = arguments[arguments.length - 1];
    if(typeof cb !== "function") throw new Error("Invalid Callback.");
    var opts = {
      hostname: 'sourcegraph.com',
      port: 443,
      path: '/api/' + url_path,
      method: type || 'GET',
      post_data: null
    };
    pre.apply(opts, Array.prototype.slice.call(arguments, 0, -1));
    var req = https.request(opts, function(res) {
      console.log(opts.path);
      var response = '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        response += chunk;
      });
      res.on('end', function() {
        try {
          response = JSON.parse(response);
          if(res.statusCode != 200) return cb(new Error("Error " + res.statusCode + ": " + response.Message));
        } catch (e) {
          if(res.statusCode != 200) return cb(new Error(response));
          return cb(new Error("Invalid JSON format received."));
        }
        return cb(null, response);
      });
    });
    if(opts.post_data) req.write(post_data);
    req.end();

    req.on('error', function(err) {
      return cb(err);
    });
  }
}

function makeResourceRegistrar(resource, base_path) {
  return function(method, pre, type) {
    registerMethod(resource, method, base_path + '/', pre, type);
  }
};

require('./Resources/repository.js')(makeResourceRegistrar);

module.exports = api_resources;
