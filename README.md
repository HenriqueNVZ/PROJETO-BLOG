# PROJETO-BLOG
# 🚀 Projeto Blog API

Uma API REST para gerenciamento de blog, com autenticação de usuários e controle completo de posts em área administrativa.

O projeto foi desenvolvido com foco em organização de código, separação de responsabilidades e aplicação de boas práticas modernas de backend. Possui rotas públicas para consumo de conteúdo e rotas protegidas para gerenciamento administrativo, garantindo segurança e controle de acesso.

---

## 📌 Descrição

O sistema permite que usuários se cadastrem, realizem login e acessem funcionalidades protegidas via JWT. A aplicação possui um fluxo completo de CRUD de posts, além de suporte a upload de imagens.

As rotas públicas permitem acesso aos conteúdos publicados, enquanto as rotas administrativas garantem controle total sobre os dados.

---

## ✅ Funcionalidades

- Cadastro e autenticação de usuários
- Geração e validação de JWT
- Proteção de rotas administrativas
- CRUD completo de posts
- Upload de imagens (cover)
- Sistema de tags
- Slug automático para URLs amigáveis
- Listagem paginada de posts

---

## 🔐 Rotas de Autenticação

- `POST /auth/signup` → Cadastro de usuário  
- `POST /auth/signin` → Login  
- `POST /auth/validate` → Validação do token  

---

## 🛠 Rotas Administrativas (Protegidas)

- `GET /admin/posts` → Listagem   
- `GET /admin/posts/:slug` → Detalhe  
- `POST /admin/posts` → Criação  
- `PUT /admin/posts/:slug` → Edição  
- `DELETE /admin/posts/:slug` → Exclusão  

---

## 🌐 Rotas Públicas

- `GET /posts` → Listagem paginada  
- `GET /posts/:slug` → Post específico  
- `GET /posts/:slug/related` → Posts relacionados  

---

## 🧪 Tecnologias utilizadas

- Node.js  
- TypeScript  
- Express  
- Prisma ORM  
- JWT (jsonwebtoken)  
- Zod (validação)  
- Multer (upload de arquivos)  
- UUID / Slug  

---

## 🔐 Segurança e boas práticas

- Autenticação baseada em JWT  
- Rotas protegidas para área administrativa  
- Validação de dados com Zod  
- Separação de responsabilidades (MVC + Service)  
- Uso de variáveis de ambiente (.env)  
- Controle de acesso por token  

---

## 🛠 Técnicas aplicadas

- Arquitetura em camadas (Controller, Service, Middleware)  
- Organização escalável de projeto  
- Manipulação de upload com Multer  
- Geração de slug para SEO e URLs limpas  
- Paginação de dados  
- Tratamento de erros e validações  

---

## 💡 Futuras melhorias

- Deploy em ambiente de produção  
- Testes automatizados  
- Upload em cloud (S3 ou similar)  
- Cache com Redis 
- Sistema de comentários  
- Dashboard com métricas  

---

## ▶️ Execução

```bash
npm install
npm run dev