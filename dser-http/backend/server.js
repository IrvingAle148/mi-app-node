const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// 1. Definimos la marca de tiempo de última modificación del recurso
const lastModifiedDate = new Date('Fri, 04 Sep 2026 12:00:00 GMT').toUTCString();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['ETag', 'Last-Modified']
};

app.use(cors(corsOptions));

app.get('/data', (req, res) => {
    const data = {
        message: "Hola, este es la información en tu Caché :("
    };

    const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`;
    
    // Capturamos el encabezado enviado por el cliente
    const clientIfModifiedSince = req.headers['if-modified-since'];

    // 2. Comparamos si el cliente envió la misma marca de tiempo guardada
    if (clientIfModifiedSince && clientIfModifiedSince === lastModifiedDate) {
        return res.status(304).end();
    }

    // 3. Si no coincide o no la envió, entregamos el recurso con la fecha Last-Modified
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', lastModifiedDate);
    res.json(data);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});