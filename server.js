const http = require('http');
const mysql = require('mysql2');

// Configurar conexión a la base de datos
const db = mysql.createConnection({
  host: '172.17.0.2',      // Si usas Docker, pon la IP del contenedor
  user: 'root',
  password: '1234',       // tu contraseña MySQL
  database: 'practica_db' // tu base de datos
});

// Conexión
db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');
});

const server = http.createServer((req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // POST - Recibir datos del formulario y guardarlos en la BD
  if (req.method === 'POST' && req.url === '/api/contacto') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const datos = JSON.parse(body);
      console.log('📥 Datos recibidos del formulario:', datos);

      const query = 'INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)';
      db.query(query, [datos.nombre, datos.email, datos.mensaje], (err, result) => {
        if (err) {
          console.error('❌ Error al insertar en la BD:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Error al guardar en la base de datos' }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ mensaje: 'Datos guardados correctamente', id: result.insertId }));
        }
      });
    });

  // POST - Crear recurso genérico
  } else if (req.method === 'POST' && req.url === '/crear') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('POST recibido:', body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ mensaje: 'Recurso creado correctamente' }));
    });

  // PUT - Actualizar recurso
  } else if (req.method === 'PUT' && req.url === '/actualizar') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('PUT recibido:', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ mensaje: 'Recurso actualizado correctamente' }));
    });

  // PATCH - Modificar parcialmente recurso
  } else if (req.method === 'PATCH' && req.url === '/modificar') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('PATCH recibido:', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ mensaje: 'Recurso modificado parcialmente' }));
    });

  // DELETE - Eliminar recurso
  } else if (req.method === 'DELETE' && req.url === '/eliminar') {
    console.log('DELETE recibido');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ mensaje: 'Recurso eliminado correctamente' }));

  // Ruta no encontrada
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
  }
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
