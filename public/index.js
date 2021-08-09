const socket = io();

document.getElementById('agregar-carrito').addEventListener('click', () => {
    const producto = {
        nombre: document.getElementById('td-nombre').textContent,
        foto: document.getElementById('td-foto').src,
        precio: document.getElementById('td-precio').textContent
      };
      socket.emit('boton', producto);
      console.log(producto)
})
// document.getElementById('borrar-carrito').addEventListener('click', () => {

// })
// document.getElementById('ver-detalle').addEventListener('click', () => {
    
// })
// document.getElementById('actualizar-producto').addEventListener('click', () => {
    
// })
// document.getElementById('borrar-producto').addEventListener('click', () => {
    
// })
document.getElementById('mySelect').addEventListener('change', (req, res) => {
    var value = req;
    console.log(req);
    document.getElementById('telefono').value(value);
});



function pickForm(e) {
    const producto = {
        nombre: document.getElementById('input-nombre').value,
        foto: document.getElementById('input-foto').value,
        precio: document.getElementById('input-precio').value
      };
      socket.emit('boton', producto);
    return false;
}

const inicioStrTable = `
<table class="table">
    <thead>
        <tr>
        <th scope="col">#</th>
        <th scope="col">nombre</th>
        <th scope="col">precio</th>
        <th scope="col">foto</th>
        </tr>
    </thead>
    <tbody>`
const prodStrTemplate = `
        <tr>
            <th scope="row">{{id}}</th>
            <td>{{nombre}}</td>
            <td>{{precio}}</td>
            <td>
                <img class="img-foto" src={{{foto}}} alt="" />
            </td>
        </tr>`;
const finStrTable = `
    </tbody>
</table>`
const productoTemplate = Handlebars.compile(prodStrTemplate);


//Aqui convertirlo a html de orden para el carrito
socket.on('productos', data => {
    const productosHtml = []
    if (data.length > 0) {
        for (const {nombre, precio, foto} of data) {
            const elhtml = productoTemplate( {nombre, precio, foto} );
            productosHtml.push(elhtml);
        }
        const elhtml = inicioStrTable + `<ul>${productosHtml.join('')}</ul>` + finStrTable;
        document.getElementById('productos').innerHTML = elhtml;
    }
    else{
        document.getElementById('productos').innerHTML = '<p>nada para mostrar</p>';
    }
})
socket.on('messages', data => {
    // console.log(data);
    render(data);
}); 
function render(data) {

    const html = data.map((elem, index) => {
        return(`<div style="color:rgb(128,64,0);">
                <strong style="color:rgb(0,0,255);">${elem.author}</strong>
                [(${elem.date})]:
                <em style="color:rgb(0,143,57);">${elem.text}</em> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}
function addMessage(e) {
    const mensaje = {
      author: document.getElementById('username').value,
      text: document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje);
    document.getElementById('texto').value = ''
    document.getElementById('texto').focus()

    return false;
}
  