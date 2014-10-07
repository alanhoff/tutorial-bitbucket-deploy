var child = require('child_process');
var Bluebird = require('bluebird');
var options = {
  cwd: '/home/www/web',
  env: process.env
};

var commands = [
  ['git', ['pull', 'origin', 'master']],
  ['npm', ['cache', 'clear']],
  ['npm', ['prune', '--production']],
  ['npm', ['install', '--production']],
  ['pm2', ['restart', '/home/www/web/.pm2rc.json']]
];

module.exports = function() {
  Bluebird.all(commands).each(function(str) {
    var promise = Bluebird.pending();

    console.log('Rodando %s', str[0]);
    var cmd = child.spawn(str[0], str[1], options);

    cmd.on('error', function(err) {
      promise.reject(err);
    });

    cmd.stdout.on('data', function(data) {
      data = data.toString().trim().replace(/\n/g, '\n>> ');
      console.log('>> %s', data);
    });

    cmd.stderr.on('data', function(data) {
      console.error('>> %s', data);
    });

    cmd.on('exit', function() {
      promise.resolve();
    });

    return promise.promise;
  }).catch(function(err) {
    console.error('Erro ao realizar deploy.');
    console.log(err.stack);
  }).then(function() {
    console.log('Deploy finalizado.');
  });
};
