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
    'firebase-init.js',  // Bloquear o arquivo estático
    '.env',
    '.env.local',
    '.env.production',
    'package.json',
    'package-lock.json',
    'server.js'
];

// Endpoint dinâmico para firebase-init.js (injeta credenciais do .env)
app.get('/firebase-init.js', (req, res) => {
    const firebaseInitScript = `
// Inicialização do Firebase - Credenciais injetadas do servidor
// NÃO MODIFIQUE ESTE ARQUIVO - Ele é gerado dinamicamente pelo servidor

let db = null;
let firebaseInitialized = false;
let initializationPromise = null;

// Configuração do Firebase (injetada do .env do servidor)
const firebaseConfig = ${JSON.stringify({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}, null, 4)};

// Função para inicializar o Firebase
async function initializeFirebase() {
    if (firebaseInitialized) {
        return { db, initialized: true };
    }
    if (initializationPromise) {
        return initializationPromise;
    }
    initializationPromise = (async () => {
        try {
            console.log('Iniciando inicialização do Firebase...');
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp(firebaseConfig);
                console.log('Firebase App inicializado');
            }
            db = firebase.firestore();
            window.db = db;
            firebaseInitialized = true;
            console.log('✅ Firebase inicializado com sucesso!');
            return { db, initialized: true };
        } catch (error) {
            console.error('❌ Erro ao inicializar Firebase:', error);
            initializationPromise = null;
            throw error;
        }
    })();
    return initializationPromise;
}

// Função helper para aguardar inicialização
window.waitForFirebase = async function() {
    if (firebaseInitialized) {
        return { db, initialized: true };
    }
    return await initializeFirebase();
};

// Inicializa automaticamente quando o script é carregado
(async () => {
    try {
        await initializeFirebase();
    } catch (error) {
        console.error('Erro na inicialização automática do Firebase:', error);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao Firebase. Por favor, recarregue a página.',
                confirmButtonText: 'Recarregar'
            }).then(() => {
                window.location.reload();
            });
        }
    }
})();
`;
    
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(firebaseInitScript);
});

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

app.get('/', (req, res) => {
    // Redireciona para login com parâmetro para forçar logout
    res.redirect('/login.html?auto=true');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 