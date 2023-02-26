function joinNs(endpoint) {
  if (nsSocket) {
    nsSocket.close();
    document
      .querySelector(`#user-input`)
      .removeEventListener(`submit`, formSubmission);
  }

  // console.log(endpoint);
  nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    // console.log(nsRooms);
    const roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';
    nsRooms.forEach((room) => {
      let glyph;
      room.privateRoom ? (glyph = `lock`) : (glyph = `globe`);

      roomList.innerHTML += `<li class="room">
    <span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}
  </li>`;
    });
    let roomNodes = document.querySelectorAll(`.room`);
    roomNodes.forEach((el) => {
      el.addEventListener(`click`, (e) => {
        console.log(`Someone clicked on ${e.target.innerText}`);
        joinRoom(e.target.innerText);
      });
    });
    const topRoom = document.querySelector(`.room`);
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on(`messageToClients`, (msg) => {
    console.log(msg);
    const newMsg = buildHTML(msg);
    document.querySelector(`#messages`).innerHTML += newMsg;
  });

  document
    .querySelector('.message-form')
    .addEventListener('submit', formSubmission);
}

function formSubmission(event) {
  event.preventDefault();

  const textInput = document.querySelector('#user-message');
  const newMessage = textInput.value;
  nsSocket.emit('newMessageToServer', { text: newMessage });
  // textInput.value = '';
  textInput.blur();
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `<li>
  <div class="user-image">
    <img src="${msg.avatar}" />
  </div>
  <div class="user-message">
    <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
    <div class="message-text">${msg.text}</div>
  </div>
</li>`;

  return newHTML;
}
