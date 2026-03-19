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

app.get('/', (req, res) => {
    // Redireciona para login com parâmetro para forçar logout
    res.redirect('/login.html?auto=true');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 