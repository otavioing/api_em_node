# 🚀 API de Usuários com IA e Emails

Bem-vindo(a)!  
Essa é uma API feita em **Node.js** que junta o útil ao agradável: gerencia usuários, troca ideia com a **IA da OpenAI** e ainda manda e-mails automáticos para várias situações.  

---

## ✨ O que essa API faz?

- **Usuários**
  - 📋 `GET /usuarios` → lista todos os usuários  
  - 👤 `GET /usuarios/:id` → pega um usuário pelo ID  
  - ➕ `POST /usuarios` → cria um novo usuário  
  - ✏️ `PUT /usuarios/:id` → atualiza um usuário existente  
  - ❌ `DELETE /usuarios/:id` → apaga um usuário  
  - 🔑 `POST /usuarios/recuperar-senha` → ajuda a recuperar a senha  

- **OpenAI**
  - 🤖 `POST /openai/chat` → manda uma mensagem pra IA da OpenAI e recebe a resposta  

- **Emails automáticos**
  - 📧 Criação de conta  
  - 🗑️ Solicitação de exclusão de conta  
  - 🔔 Notificação de login  
  - 🔐 Recuperação de senha  

---

## 📂 Estrutura básica

- **/public** → exemplos de como usar a API direto no HTML  
- **/src** → aqui mora o código da API (rotas, controllers, etc.)  
- **.env** → onde você coloca as credenciais (banco, API key da OpenAI e por aí vai)  
- **banco.sql** → o script do banco de dados pra importar no XAMPP  

---

## 🛠️ Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/otavioing/api_em_node.git
cd api_em_node

# 2. Importe o banco
# Abra o phpMyAdmin (via XAMPP) e importe o arquivo banco.sql que está no repositório

# 3. Configure o .env
# Copie o arquivo .env.example para .env e complete com suas informações

# 4. Instale as dependências
npm i

# 5. Suba o servidor
npm run start:dev
