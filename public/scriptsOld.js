const socket = io('http://localhost:9000'); // '/' name space
const socket2 = io('http://localhost:9000/admin'); // '/admin' namespace

socket.on('connect', () => {
  console.log(`SOCKET ID: `, socket.id);
});

socket2.on('connect', () => {
  console.log(`SOCKET2 ID: `, socket2.id);
});

socket.on('welcome', (msg) => {
  console.log(`MSG IN SOCKET2 WELCOME LISTENER: ${msg}`);
});

socket.on('messageFromServer', (dataFromServer) => {
  // console.log(dataFromServer);
  socket.emit('messageToServer');

  document
    .querySelector('#message-form')
    .addEventListener('submit', (event) => {
      event.preventDefault();

      const textInput = document.querySelector('#user-message');
      const newMessage = textInput.value;
      // console.log(newMessage);
      socket.emit('newMessageToServer', { text: newMessage });

      textInput.value = '';
    });

  socket.on('messageToClients', (msg) => {
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
  });

  // socket.on('ping', () => {
  //   console.log('Ping was received from the server');
  // });

  // socket.on(`pong`, (latency) => {
  //   console.log(latency);
  //   console.log(`pong was saved to the server`);
  // });
});
