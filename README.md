# Arabe Agente de IA - Site do Agente Criador de Sites

Este projeto transforma o agente em um site completo com:

- Página inicial profissional
- Seção de recursos
- Modelos de prompts prontos
- Chat com agente de IA
- Backend em Node.js + Express
- Integração com OpenAI via variável `OPENAI_API_KEY`
- Modo demonstração caso a chave ainda não esteja configurada

## Como rodar no Windows pelo CMD

1. Extraia a pasta `arabe-agente-ia-site`.
2. Abra o CMD dentro da pasta.
3. Rode:

```bat
npm install
```

4. Copie o arquivo de ambiente:

```bat
copy .env.example .env
```

5. Abra o `.env` e coloque sua chave:

```env
OPENAI_API_KEY=sua_chave_aqui
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
```

6. Ligue o site:

```bat
npm start
```

7. Acesse no navegador:

```text
http://localhost:3000
```

## Como personalizar

- Textos e layout: `public/index.html`
- Cores e visual: `public/style.css`
- Funcionamento do chat: `public/app.js`
- Personalidade do agente: `server.js`, variável `systemPrompt`

## Observação importante

Não coloque sua chave da OpenAI dentro do `public/app.js`, porque arquivos públicos aparecem para qualquer pessoa no navegador. A chave deve ficar somente no `.env`.
