
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ error: 'Mensagem vazia' });
  }

  const prompt = `
Você é o KaringanaBot, um assistente cultural e ecológico de Moçambique.
Sua missão é educar sobre a cultura moçambicana e os ODS (como a proteção do ambiente).
Responda à seguinte pergunta com clareza, respeito e conhecimento:

"${mensagem}"
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return res.status(200).json({
      resposta: data.choices?.[0]?.message?.content || "Sem resposta.",
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar a resposta.' });
  }
}
