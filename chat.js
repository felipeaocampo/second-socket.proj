//IMPORTS
const express = require('express');
const socketio = require(`socket.io`);

//CREATION OF APP
const app = express();

//ROUTING TO STATIC FILE FOLDER
app.use(express.static(__dirname + '/public'));

// CREATION OF EXPRESS SEVER/PORT CONNECTION
const expressServer = app.listen(9000);

//CONNECTING SERVER W/ SOCKETIO
const io = socketio(expressServer);
//test

//CREATION OF SOCKET(S) CONNECTION
io.on('connection', (socket) => {
  //SENDING
  socket.emit(`messageFromServer`);
  //RECEVING
  socket.on(`messageToServer`, () => {});

  //NOW THAT CONNECTION IS ESTABLISHED, PLAY!
  //CONNECTION BY ROOM, ALL BY CLIENT SENDER RECEIVES IT
  socket.join(`level1`);
  socket
    .to(`level1`)
    .emit('joined', `${socket.id} has joined the level 1 ROOM`);

  // CONNECTION BY NAMESPACE, EVERYONE RECEIVES IT
  // io.of(`/`)
  //   .to(`level1`)
  //   .emit('joined', `${socket.id} has joined the level 1 ROOM`);
});

io.of(`/admin`).on('connection', (socket) => {
  // console.log(`Someone connected to the admin namespace!`);

  io.of('/admin').emit('welcome', 'Welcome to the admin channel!');
});
