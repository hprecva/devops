const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  // Importa cors

// Configurar la app
const app = express();
app.use(bodyParser.json());
app.use(cors());  // Habilitar CORS para todas las rutas
app.use(express.static('public'));

// Conectar con la base de datos SQLite en un archivo (persistente)
const db = new sqlite3.Database('./animes.db');

// Crear tabla de animes si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS animes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            release_year INTEGER NOT NULL,
            seasons INTEGER NOT NULL,
            type TEXT NOT NULL,
            author TEXT NOT NULL
        )
    `);
});

// Endpoint para agregar un nuevo anime
app.post('/anime', (req, res) => {
    const { title, release_year, seasons, type, author } = req.body;
    
    db.run(
        `INSERT INTO animes (title, release_year, seasons, type, author) VALUES (?, ?, ?, ?, ?)`,
        [title, release_year, seasons, type, author],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ id: this.lastID });
        }
    );
});

// Endpoint para obtener todos los animes
app.get('/animes', (req, res) => {
    db.all(`SELECT * FROM animes`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ data: rows });
    });
});

// Endpoint para obtener un anime por ID
app.get('/anime/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM animes WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ data: row });
    });
});

// Endpoint para actualizar un anime por ID
app.put('/anime/:id', (req, res) => {
    const { id } = req.params;
    const { title, release_year, seasons, type, author } = req.body;

    db.run(
        `UPDATE animes SET title = ?, release_year = ?, seasons = ?, type = ?, author = ? WHERE id = ?`,
        [title, release_year, seasons, type, author, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: `Anime con ID ${id} actualizado` });
        }
    );
});

// Endpoint para eliminar un anime por ID
app.delete('/anime/:id', (req, res) => {
    const { id } = req.params;
    
    db.run(`DELETE FROM animes WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `Anime con ID ${id} eliminado` });
    });
});

// Iniciar el servidor
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;