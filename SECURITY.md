# Política de Segurança

## 🔒 Práticas de Segurança Implementadas

### Autenticação
- ✅ Sistema de autenticação via Firebase Auth
- ✅ Verificação de email obrigatória
- ✅ Domínio restrito: apenas @grupohi.com.br
- ✅ Proteção de todas as páginas sensíveis
- ✅ Redirect automático para login se não autenticado

### Proteção de Arquivos Sensíveis
- ✅ Arquivos .env **NUNCA** são commitados
- ✅ Arquivos .bak bloqueados no servidor
- ✅ package.json não acessível publicamente
- ✅ server.js não acessível publicamente

### Headers de Segurança
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ CORS restrito ao domínio próprio

### HTTPS/SSL
- ✅ Certificado SSL Let's Encrypt
- ✅ Renovação automática configurada
- ✅ Redirect automático HTTP → HTTPS

### Firebase Configuration
**Como as credenciais Firebase são gerenciadas:**

- ✅ Credenciais armazenadas no arquivo `.env` do servidor (nunca commitado)
- ✅ Arquivo `firebase-init.js` **bloqueado** para acesso estático
- ✅ Rota dinâmica `/firebase-init.js` injeta credenciais do `.env` em tempo real
- ✅ Cache desabilitado para garantir credenciais sempre atualizadas
- ✅ Nenhuma credencial hardcoded em arquivos públicos

**Como funciona a segurança:**
- 🔒 `.env` no servidor (protegido, não versionado)
- 🔒 Firebase Security Rules controlam acesso aos dados
- 🔒 Apenas usuários autenticados (@grupohi.com.br) têm acesso
- 🔒 Credenciais são injetadas dinamicamente quando solicitadas

**Nota**: Firebase API keys não são secrets (ver [docs](https://firebase.google.com/docs/projects/api-keys)), mas ainda assim mantemos as credenciais centralizadas no `.env` para facilitar gerenciamento e seguir best practices de DevOps.

## ⚠️ Arquivos que NUNCA devem ser expostos

```
.env
.env.*
*.bak
*.backup
credentials.json
secrets.json
server.js
package.json
node_modules/
```

## 🔧 Configuração de Segurança

### Firestore Rules (configure no Firebase Console):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null 
                       && request.auth.token.email.matches('.*@grupohi.com.br$');
    }
    
    // Logs de login - apenas leitura para autenticados
    match /login_logs/{logId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Realtime Database Rules:

```json
{
  "rules": {
    ".read": "auth != null && auth.token.email.matches(/.*@grupohi\\.com\\.br$/)",
    ".write": "auth != null && auth.token.email.matches(/.*@grupohi\\.com\\.br$/)"
  }
}
```

## 🚨 Reportar Vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança, por favor:
1. **NÃO** abra uma issue pública
2. Entre em contato diretamente: aylton@grupohi.com.br
3. Aguarde confirmação antes de divulgar

## 📋 Checklist de Segurança

Antes de fazer deploy:
- [ ] Arquivo .env configurado no servidor
- [ ] Firestore Security Rules atualizadas
- [ ] Realtime Database Rules atualizadas
- [ ] SSL/HTTPS funcionando
- [ ] CORS configurado corretamente
- [ ] Arquivos sensíveis bloqueados
- [ ] Autenticação testada
- [ ] Backup configurado

## 🔄 Atualizações de Segurança

Para atualizar o sistema:
```bash
cd /www/nrs-frontend-02
git pull origin main
npm install
pm2 restart nrs-frontend-02
```

## 📞 Contato

Para questões de segurança: aylton@grupohi.com.br
