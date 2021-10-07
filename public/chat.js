const socket = io.connect();

// window.addEventListener('DOMContentLoaded', (event) => {
//   console.log('DOM fully loaded and parsed');
//   console.log(document.getElementsByName('username').value)
// });

socket.on('messages', data => {
  // console.log(data);
  render(data);
});

function render(data) {
    const html = data.map((elem, index) => {
      return(`<div>
                <strong style="color:rgb(0,0,255);">${elem.author}</strong>:
                <em style="color:rgb(0,143,57);">${elem.text}</em>
                <strong>${elem.date}</strong>
              </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    const mensaje = {
      author: document.getElementById('username').value,
      text: document.getElementById('texto').value,
      date: ` Fecha: ${new Date().toLocaleDateString()} Hora: ${new Date().toLocaleTimeString()} `
    };
    console.log(mensaje)
    socket.emit('new-message', mensaje);

    document.getElementById('texto').value = ''
    document.getElementById('texto').focus()

    return false;
}