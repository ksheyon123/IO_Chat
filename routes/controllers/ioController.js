var socketio = require('socket.io');

module.exports.listen = function(server) {
  console.log('a')
  io = socketio.listen(server);
  io.on('connection', function(socket) {
    console.log('hi')
  // ... do something

  });
  return io;
}