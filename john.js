const path = require('path');
const Max = require('max-api');

// This will be printed directly to the Max console
Max.post(`Loaded the ${path.basename(__filename)} script`);
Max.outlet('hownoisy');
// Use the 'addHandler' function to register a function for a particular message

// Use the 'outlet' function to send messages out of node.script's outlet
Max.addHandler('echo', msg => {
  Max.outlet(msg);
  console.log(msg);
});

var noiz = 0;
Max.addHandler('noisy', val => {
  noiz = val;
});

var room = 'wholemaxhole';

const io = require('socket.io-client');

var socket = io('localhost:3000');
// , {
// 	'force new connection': true,
// 	"reconnectionAttempts": "Infinity",
// 	"timeout": 10000,
// 	"transports" :["websocket"]
// 	});

//
socket.on('connect', () => {
  if (noiz) {
    Max.post('the socket is connected');
  } // true
  socket.emit('maxjoin', 'hello');
  socket.emit('joinRoom', room);
});
//
socket.on('your_id_is', data => {
  if (noiz) {
    Max.post('your socket id is ' + data);
  }
});
//
socket.on('from_maxhole', data => {
  //Max.setDict('data', data);

  Max.outlet('msg', data);
});
//
//

//
//
socket.on('error', error => {
  if (noiz) Max.post(error);
});
////////MAX STUFF

Max.addHandler('emit', () => {
  Max.getDict('sock')
    .then(dict => {
      sock = dict;
      if (noiz) {
        Max.post('emitting ' + sock.data);
      }
      //socket.emit('to_maxhole',sock.data); ///add broadcast specifics here?
      socket.emit('to_room', room, sock.data);
      if (noiz) {
        Max.post('emitting ' + sock.data + 'to ' + room);
      }
    })
    .catch(err => {
      if (noiz) Max.post(err);
    });
});

Max.addHandler('room', newroom => {
  socket.emit('leaveRoom', room);
  if (noiz) Max.post('leaving ' + room);
  room = newroom;
  socket.emit('joinRoom', room);
  if (noiz) Max.post('joining ' + room);
});

///Dict
var sock = Max.getDict('sock');

Max.addHandler('bang', () => {
  Max.post(sock);
});
