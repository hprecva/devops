const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = require('../api_rest'); // Importar tu aplicación

// Crear base de datos en memoria para pruebas
const db = new sqlite3.Database(':memory:');

beforeAll((done) => {
    // Crear tabla antes de ejecutar las pruebas
    db.run(`
        CREATE TABLE animes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            release_year INTEGER NOT NULL,
            seasons INTEGER NOT NULL,
            type TEXT NOT NULL,
            author TEXT NOT NULL
        )
    `, done);
});

afterAll(() => {
    // Cerrar la base de datos después de las pruebas
    db.close();
});

describe('Pruebas para la API de Animes', () => {
    it('Debería crear un nuevo anime', async () => {
        const anime = {
            title: 'Naruto',
            release_year: 2002,
            seasons: 5,
            type: 'Shonen',
            author: 'Masashi Kishimoto'
        };

        const res = await request(app)
            .post('/anime')
            .send(anime);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    it('Debería obtener la lista de animes', async () => {
        const res = await request(app).get('/animes');
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('Debería eliminar un anime', async () => {
        const anime = {
            title: 'Attack on Titan',
            release_year: 2013,
            seasons: 4,
            type: 'Shonen',
            author: 'Hajime Isayama'
        };

        // Primero creamos el anime
        const createRes = await request(app)
            .post('/anime')
            .send(anime);
        
        const animeId = createRes.body.id;

        // Luego lo eliminamos
        const deleteRes = await request(app)
            .delete(`/anime/${animeId}`);
        
        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body.message).toBe(`Anime con ID ${animeId} eliminado`);
    });
});
