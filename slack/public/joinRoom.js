function joinRoom(roomName) {
  //SEND ROOMNAME TO SERVER SO SERVER CAN JOIN CLIENT TO ROOM
  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    //UPDATED ROOM TOTAL
    document.querySelector(
      `.curr-room-num-users`
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
  });
}
