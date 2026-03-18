const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos, mas bloqueia o acesso a firebase-config.js
app.use(express.static(path.join(__dirname, 'web-dashboard'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('firebase-config.js')) {
            res.status(403).send('Access Denied');
        }
    }
}));

// Endpoint para fornecer configuração do Firebase de forma segura
app.get('/api/firebase-config', (req, res) => {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };
    res.json(firebaseConfig);
});

app.get('/', (req, res) => {
    // Redireciona para login com parâmetro para forçar logout
    res.redirect('/login.html?auto=true');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 