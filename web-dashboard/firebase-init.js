// Inicialização do Firebase de forma segura
// Configuração direta (seguro - Firebase tem regras de segurança próprias)

let db = null;
let firebaseInitialized = false;
let initializationPromise = null;

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2wdGyqHKntFJKgjbu8gx2L0Fi740Ws7w",
    authDomain: "hipag-02.firebaseapp.com",
    databaseURL: "https://hipag-02-default-rtdb.firebaseio.com",
    projectId: "hipag-02",
    storageBucket: "hipag-02.appspot.com",
    messagingSenderId: "1096728529428",
    appId: "1:1096728529428:web:6f8be1d07a713a223d3501"
};

// Função para inicializar o Firebase
async function initializeFirebase() {
    // Se já inicializou, retorna imediatamente
    if (firebaseInitialized) {
        return { db, initialized: true };
    }

    // Se já está inicializando, aguarda a promise existente
    if (initializationPromise) {
        return initializationPromise;
    }

    // Cria nova promise de inicialização
    initializationPromise = (async () => {
        try {
            console.log('Iniciando inicialização do Firebase...');
            
            // Verifica se o Firebase já foi inicializado
            if (!firebase.apps || firebase.apps.length === 0) {
                // Inicializa o Firebase
                firebase.initializeApp(firebaseConfig);
                console.log('Firebase App inicializado');
            }
            
            // Inicializa o Firestore
            db = firebase.firestore();
            
            // Torna db disponível globalmente
            window.db = db;
            
            firebaseInitialized = true;
            
            console.log('✅ Firebase inicializado com sucesso!');
            return { db, initialized: true };
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Firebase:', error);
            initializationPromise = null; // Permite tentar novamente
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
        // Mostra alerta amigável para o usuário
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
