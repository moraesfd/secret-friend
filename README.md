# Sorteador de Amigo Secreto

Este é um projeto de sorteador de amigo secreto desenvolvido com React, TypeScript e Vite. Ele permite adicionar participantes, realizar o sorteio e enviar emails com os resultados utilizando a biblioteca EmailJS.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior) ou yarn (versão 1.22 ou superior)

## Instalação

1. Clone o repositório:

```sh
git clone https://github.com/seu-usuario/sorteador-amigo-secreto.git
cd sorteador-amigo-secreto
```

2. Instale as dependências:

```sh
npm install
# ou
yarn install
```

## Configuração

### EmailJS

Para configurar o envio de emails, você precisará de uma conta no EmailJS. Siga os passos abaixo para configurar:

1. Crie uma conta no EmailJS.
2. Crie um novo serviço de email e anote o Service ID.
3. Crie um novo template de email e anote o Template ID.
4. Vá para a seção de integrações e anote o Public Key.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente com os valores obtidos no EmailJS:

```sh
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_EMAILJS_PUBLIC_KEY=sua_public_key
```

## Uso

1. Inicie o servidor de desenvolvimento:

```sh
npm run dev
# ou
yarn dev
```

2. Abra o navegador e acesse [http://localhost:5173](http://localhost:5173).

## Scripts Disponíveis

- `dev`: Inicia o servidor de desenvolvimento.
- `build`: Compila o projeto para produção.
- `lint`: Executa o linter (ESLint).
- `preview`: Visualiza a versão de produção.

## Estrutura do Projeto

- `src/`: Contém o código-fonte do projeto.
  - `@types/`: Tipos TypeScript utilizados no projeto.
  - `assets/`: Arquivos estáticos.
  - `constants/`: Constantes utilizadas no projeto.
  - `pages/`: Páginas da aplicação.
  - `router/`: Configuração das rotas.
- `public/`: Arquivos públicos.
- `index.html`: Arquivo HTML principal.
- `tailwind.config.js`: Configuração do Tailwind CSS.
- `tsconfig.json`: Configuração do TypeScript.
- `vite.config.ts`: Configuração do Vite.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Buy Me a Coffee

Se você gostou deste projeto, considere me apoiar comprando um café!

<a href="https://www.buymeacoffee.com/moraesfd"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=moraesfd&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
