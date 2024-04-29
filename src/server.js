const path = require('path');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

//By Rex Dev
const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DESAFIO2'
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function crearTablaProductos() {
  const query = `
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      precio DECIMAL(10, 2) NOT NULL,
      descripcion TEXT
    )
  `;

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error al crear la tabla de productos:', error);
    } else {
      console.log('Tabla "productos" creada correctamente');
    }
  });
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/productos', (req, res) => {
  const query = 'SELECT * FROM productos';
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/agregar-producto', (req, res) => {
  const { nombre, precio, descripcion } = req.body;
  const query = 'INSERT INTO productos (nombre, precio, descripcion) VALUES (?, ?, ?)';
  connection.query(query, [nombre, precio, descripcion], (error, results, fields) => {
    if (error) throw error;
    res.send('Producto agregado correctamente');
  });
});


app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
  crearTablaProductos();
});