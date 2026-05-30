import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static('public'));

const systemPrompt = `
Você é o Arabe Agente de IA, um agente profissional que cria sites, sistemas web e layouts completos para o usuário.
Responda sempre em português do Brasil, com linguagem simples, direta e prática.
Seu foco é entregar código pronto, organizado e fácil de rodar no Windows pelo CMD.

Quando o usuário pedir um site ou sistema, entregue:
1. Estrutura de pastas.
2. Código separado por arquivo.
3. Explicação curta de como rodar.
4. Melhorias profissionais de layout, responsividade, botões e UX.
5. Observações de segurança quando houver login, banco de dados, pagamentos ou APIs.

Regras:
- Nunca invente que acessou o computador do usuário.
- Se faltar informação, faça uma versão inicial usando boas escolhas e diga o que ele pode alterar.
- Para projetos simples, use HTML, CSS e JavaScript.
- Para projetos com backend, use Node.js + Express.
- Deixe o visual moderno, profissional e sem cara de gerado por IA.
`;

function demoAnswer(message) {
  return `Estou em modo demonstração porque a chave OPENAI_API_KEY ainda não foi configurada no arquivo .env.\n\nMesmo assim, aqui vai uma base do que eu criaria para: "${message}"\n\nEstrutura sugerida:\n\n\`\`\`text\nmeu-site/\n├── index.html\n├── style.css\n└── script.js\n\`\`\`\n\nPosso criar uma landing page profissional com topo, seção principal, serviços, benefícios, depoimentos, formulário de contato e rodapé.\n\nPara ativar a IA de verdade:\n\n\`\`\`bat\ncopy .env.example .env\nnotepad .env\nnpm install\nnpm start\n\`\`\`\n\nDepois coloque sua chave da OpenAI em OPENAI_API_KEY.`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [] } = req.body;
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user')?.content || '';

    if (!lastUserMessage.trim()) {
      return res.status(400).json({ error: 'Mensagem vazia.' });
    }

    if (!client) {
      return res.json({ reply: demoAnswer(lastUserMessage) });
    }

    const conversation = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-12).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: String(msg.content || '').slice(0, 8000)
      }))
    ];

    const response = await client.responses.create({
      model: MODEL,
      input: conversation
    });

    res.json({ reply: response.output_text || 'Não consegui gerar uma resposta agora.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao consultar a IA.',
      details: error?.message || 'Erro desconhecido.'
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: MODEL, aiConfigured: Boolean(client) });
});

app.listen(PORT, () => {
  console.log(`Arabe Agente de IA rodando em http://localhost:${PORT}`);
});
