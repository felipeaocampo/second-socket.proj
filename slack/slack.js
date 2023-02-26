//IMPORTS
const express = require('express');
const socketio = require(`socket.io`);

let namespaces = require(`./data/namespaces`);
// console.log(namespaces[0]);

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
  //
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  socket.emit(`nsList`, nsData);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
    nsSocket.on(`joinRoom`, (roomToJoin, numberOfUsersCallback) => {
      //
      nsSocket.join(roomToJoin);
      io.of('/wiki')
        .in(roomToJoin)
        .clients((err, clients) => {
          // console.log(clients.length);
          numberOfUsersCallback(clients.length);
        });
    });

    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: 'testtest',
        avatar: 'https://via.placeholder.com/30',
      };
      console.log(fullMsg);
      console.log(nsSocket.rooms);
      //
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      io.of(`/wiki`).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});
