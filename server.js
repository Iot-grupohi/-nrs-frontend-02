const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS mais restritivo - apenas o próprio domínio
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://nrs.grupohi.com.br', 'http://localhost:3000'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Lista de arquivos sensíveis bloqueados
const blockedFiles = [
    'firebase-config.js',
    'firebase-config.js.bak',
    '.env',
    '.env.local',
    '.env.production',
    'package.json',
    'package-lock.json',
    'server.js'
];

// Serve arquivos estáticos com proteção
app.use(express.static(path.join(__dirname, 'web-dashboard'), {
    setHeaders: (res, filePath) => {
        const fileName = path.basename(filePath);
        
        // Bloquear arquivos sensíveis
        if (blockedFiles.some(blocked => fileName.endsWith(blocked))) {
            res.status(403).send('Access Denied');
            return;
        }
        
        // Adicionar headers de segurança
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
    }
}));

// Endpoint protegido para configuração do Firebase
// Apenas acessível via requisições do próprio domínio (graças ao CORS)
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