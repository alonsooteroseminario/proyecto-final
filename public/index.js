document.getElementById('agregar-carrito').addEventListener('click', () => {
    const producto = {
        nombre: document.getElementById('td-nombre').textContent,
        foto: document.getElementById('td-foto').src,
        precio: document.getElementById('td-precio').textContent
      };
      socket.emit('boton', producto);
      console.log(producto)
})
let id = document.getElementById('input-id');
// mutation & variables para agregar producto
var mutation = `mutation{
    deleteCarritoGraphql(id: ${id}) {

    }
}`
var variables = {}
const fetchPOSTdata = async () => {
    const res = await fetch('http://localhost:8080/carrito/graphql', {
        method: 'POST',
        headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
        body: JSON.stringify({
                    mutation,
                    variables 
                })
    });
    // const data = await res.json();
}
// event listener, ejecutar  funcion() para traer info del formulario
document.getElementById('miBoton').addEventListener('click', () => { fetchPOSTdata() });

document.getElementById('mySelect').addEventListener('change', (req, res) => {
    var value = req;
    console.log(req);
    document.getElementById('telefono').value(value);
});

const socket = io.connect();

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
  