/**
 * Created by ysahn on 4/8/15.
 */
var Hapi = require("hapi");
var Lodash = require("lodash");
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './config/ecolearnia-studio.conf.json' });

var port = nconf.get('port');
var coheviumConf = nconf.get('cohevium');
var logConf = nconf.get('log');

var server = new Hapi.Server();
server.connection(
    {
        port: port,
        labels: 'main',
        routes: { cors: true }
    }
);

Lodash.extend(coheviumConf, {
    log: logConf
});

server.register([
    { register: require("lout") },
    { register: require("cohevium"), options: coheviumConf }
], function(err) {
    if (err) throw err;
    server.start(function() {
        console.log("EcoLearniaStudio server started @ " + server.info.uri);
    });
});