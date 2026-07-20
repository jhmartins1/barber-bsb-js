# 💈 Barber Brasilia

Sistema completo de agendamento para barbearias, com painel administrativo e área do cliente. Permite gerenciar barbeiros, serviços, dias e horários de atendimento, além de possibilitar que o cliente crie sua conta e realize agendamentos de corte de forma simples e rápida.

🔗 **Demo:** [barber-bsb-js-web-uacw.vercel.app](https://barber-bsb-js-web-uacw.vercel.app)

---

## ✨ Funcionalidades

### 👤 Cliente
- Login via **Google** ou **e-mail e senha**
- Visualização de barbeiros e serviços disponíveis
- Agendamento de horários de corte
- Acompanhamento dos próprios agendamentos

### 🛠️ Admin
- Cadastro e gerenciamento de barbeiros
- Cadastro e gerenciamento de serviços
- Adição e remoção de dias/horários de atendimento
- Controle geral da operação da barbearia

---

## 🚀 Tecnologias

Este projeto foi criado com o [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) e utiliza:

| Categoria | Tecnologia |
|---|---|
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| Frontend | [Next.js](https://nextjs.org/) |
| Backend | [Elysia](https://elysiajs.com/) |
| Estilização | [TailwindCSS](https://tailwindcss.com/) |
| Componentes UI | [shadcn/ui](https://ui.shadcn.com/) |
| Runtime | [Bun](https://bun.sh/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Banco de dados | [PostgreSQL](https://www.postgresql.org/) |
| Autenticação | [Better-Auth](https://www.better-auth.com/) |
| Monorepo | [Turborepo](https://turbo.build/) |

---

## 📁 Estrutura do projeto

```
barberjs/
├── apps/
│   ├── web/         # Aplicação frontend (Next.js)
│   └── server/      # API backend (Elysia)
├── packages/
│   ├── api/          # Camada de API / lógica de negócio
│   ├── auth/          # Configuração e lógica de autenticação
│   └── db/            # Schema e queries do banco de dados
```

---

## ✅ Pré-requisitos

- [Bun](https://bun.sh/) instalado
- Instância do [PostgreSQL](https://www.postgresql.org/) disponível (local ou via Docker)

---

## ⚙️ Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/jhmartins1/barber-bsb-js.git
cd barber-bsb-js
bun install
```

### Configuração do banco de dados

1. Suba/configure uma instância do PostgreSQL (o projeto já inclui um `docker-compose.yml` para facilitar).
2. Configure as variáveis de ambiente com base no `.env.example`, preenchendo o `apps/server/.env` com os dados de conexão do banco.
3. Aplique o schema ao banco:

```bash
bun run db:push
```

### Rodando o projeto

```bash
bun run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3333](http://localhost:3333)

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `bun run dev` | Inicia todas as aplicações em modo desenvolvimento |
| `bun run dev:web` | Inicia apenas a aplicação web |
| `bun run dev:server` | Inicia apenas o servidor |
| `bun run build` | Build de todas as aplicações |
| `bun run check-types` | Verifica os tipos TypeScript em todo o monorepo |
| `bun run db:push` | Aplica alterações do schema ao banco |
| `bun run db:studio` | Abre a interface do Prisma Studio |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

---

## 📄 Licença

Este projeto ainda não possui uma licença definida.
