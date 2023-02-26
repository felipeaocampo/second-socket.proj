const username = prompt(`What is your username?`);

// const socket = io('http://localhost:9000'); // '/' name space
const socket = io('http://localhost:9000', {
  query: {
    username: username,
  },
}); // '/' name space
// const socket2 = io('http://localhost:9000/wiki'); // '/wiki' namespace
// const socket3 = io('http://localhost:9000/mozilla'); // '/mozilla' namespace
// const socket4 = io('http://localhost:9000/linux'); // '/linux' namespace

let nsSocket = '';

socket.on('nsList', (nsData) => {
  // console.log(`LIST OF NAMESPACES ARRIVED!`);
  const namespacesDiv = document.querySelector(`.namespaces`);
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}" /></div>`;
  });

  document.querySelectorAll(`.namespace`).forEach((el) => {
    el.addEventListener(`click`, (e) => {
      const parent = e.target.closest(`div`);
      const nsEndpoint = parent.getAttribute(`ns`);
      console.log(`I should go here now ${nsEndpoint}`);
      joinNs(nsEndpoint);
    });
  });
  joinNs(`/wiki`);
});
