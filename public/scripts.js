const socket = io('http://localhost:9000'); // '/' name space
const socket2 = io('http://localhost:9000/admin'); // '/admin' namespace

socket.on('messageFromServer', (dataFromServer) => {
  // console.log(dataFromServer);
  socket.emit('messageToServer');
});

socket.on(`joined`, (msg) => {
  console.log(msg);
});

socket2.on(`welcome`, (dataFromServer) => {
  console.log(dataFromServer);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const textInput = document.querySelector('#user-message');
  const newMessage = textInput.value;
  // console.log(newMessage);
  socket.emit('newMessageToServer', { text: newMessage });

  textInput.value = '';
});
