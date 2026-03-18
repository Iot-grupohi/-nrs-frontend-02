# NRS Monitor - Dashboard de Lojas

Sistema de monitoramento de lojas com Firebase.

## Configuração

### 1. Instalar Dependências

```bash
cd nrs-monitor
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Firebase:

```env
FIREBASE_API_KEY=sua_api_key_aqui
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_DATABASE_URL=https://seu_projeto.firebaseio.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id
PORT=3000
```

**IMPORTANTE:** O arquivo `.env` contém informações sensíveis e **NÃO DEVE** ser commitado no Git. Ele já está incluído no `.gitignore`.

### 3. Iniciar o Servidor

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## Segurança

As credenciais do Firebase agora são:

1. ✅ Armazenadas no arquivo `.env` (não versionado)
2. ✅ Fornecidas via API endpoint `/api/firebase-config` 
3. ✅ Não acessíveis diretamente pelo navegador
4. ✅ O arquivo antigo `firebase-config.js` foi renomeado para `.bak`

### Endpoint de Configuração

O servidor expõe um endpoint seguro em `/api/firebase-config` que fornece as configurações do Firebase para o frontend. Este endpoint:

- Lê as configurações das variáveis de ambiente
- Retorna apenas as configurações necessárias
- Não expõe outras variáveis de ambiente sensíveis

## Estrutura de Arquivos

```
nrs-monitor/
├── .env                    # Variáveis de ambiente (não versionado)
├── .env.example           # Exemplo de configuração
├── server.js              # Servidor Express
├── package.json           # Dependências
└── web-dashboard/
    ├── firebase-init.js   # Inicialização segura do Firebase
    ├── index.html         # Dashboard principal
    ├── login.html         # Página de login
    ├── lojas.html         # Lista de lojas
    ├── loja.html          # Detalhes da loja
    └── logs.html          # Logs do sistema
```

## Migração Completa

A migração incluiu:

1. ✅ Criação do arquivo `.env` com as credenciais
2. ✅ Criação do arquivo `.env.example` como template
3. ✅ Atualização do `server.js` com endpoint `/api/firebase-config`
4. ✅ Criação do `firebase-init.js` para inicialização dinâmica
5. ✅ Atualização de todos os arquivos HTML para usar `firebase-init.js`
6. ✅ Backup do arquivo antigo `firebase-config.js`

## Deploy em Produção

Ao fazer deploy em produção:

1. Configure as variáveis de ambiente no servidor de produção
2. Nunca commite o arquivo `.env`
3. Use variáveis de ambiente do sistema ou serviços como Heroku Config Vars, AWS Secrets Manager, etc.
