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

//CREATION OF SOCKET(S) CONNECTION
io.on('connection', (socket) => {
  //SENDING
  socket.emit(`messageFromServer`);
  //RECEVING
  socket.on(`messageToServer`, () => {});

  //NOW THAT CONNECTION IS ESTABLISHED, PLAY!
  socket.on('newMessageToServer', (msg) => {
    io.emit('messageToClients', { text: msg.text });
    io.of('/').emit('messageToClients', { text: msg.text });
  });
});

io.of(`/admin`).on('connection', (socket) => {
  // console.log(`Someone connected to the admin namespace!`);

  io.of('/admin').emit('welcome', 'Welcome to the admin channel!');
});
