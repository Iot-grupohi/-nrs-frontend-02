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

### Firestore Security Rules
As credenciais do Firebase no frontend são seguras porque:
- A segurança real está nas **Firestore Security Rules**
- Apenas usuários autenticados podem acessar dados
- Regras de leitura/escrita configuradas no Firebase Console

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
