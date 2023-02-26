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
  // console.log(socket.handshake);
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
    const username = nsSocket.handshake.query.username;
    // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    nsSocket.emit('nsRoomLoad', namespace.rooms);
    nsSocket.on(`joinRoom`, (roomToJoin, numberOfUsersCallback) => {
      //

      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);
      nsSocket.join(roomToJoin);

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      nsSocket.emit(`historyCatchUp`, nsRoom.history);
      //
      updateUsersInRoom(namespace, roomToJoin);
    });

    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: 'https://via.placeholder.com/30',
      };
      // console.log(fullMsg);
      // console.log(nsSocket.rooms);
      //
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      //
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });
      nsRoom.addMessage(fullMsg);
      // console.log(nsRoom);
      //
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});

function updateUsersInRoom(namespace, roomToJoin) {
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((err, clients) => {
      // console.log(`There are ${clients.length} clients in this room`);
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit('updateMembers', clients.length);
    });
}
