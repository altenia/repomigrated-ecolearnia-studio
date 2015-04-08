/**
 * Created by ysahn on 4/8/15.
 */
var Hapi = require("hapi");
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './config/cohevium.conf.json' });

var port = nconf.get('port');
var contentBaseDir = nconf.get('contentBaseDir');
var logConf = nconf.get('log');

var server = new Hapi.Server();
server.connection(
    {
        port: port,
        labels: 'main',
        routes: { cors: true }
    }
);

server.register([
    { register: require("lout") },
    { register: require("cohevium"), options: { contentBaseDir: contentBaseDir, log: logConf, publicpath: 'public'} }
], function(err) {
    if (err) throw err;
    server.start(function() {
        console.log("Cohevium server started @ " + server.info.uri);
    });
});