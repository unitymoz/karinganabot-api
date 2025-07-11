// api/karingana.js (Express + Fetch)
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/karingana", async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ error: "Mensagem vazia" });
  }

  const prompt = `
  Você é o KaringanaBot, um assistente cultural e ecológico de Moçambique.
  Sua missão é educar sobre a cultura moçambicana e os ODS (como a proteção do ambiente).
  Responda com clareza, respeito e conhecimento:

  "${mensagem}"
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://karingana-unitymoz.web.app", // seu domínio
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5", // modelo gratuito bom
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const resposta = data.choices?.[0]?.message?.content || "Sem resposta.";

    res.json({ resposta });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao processar a resposta" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor online na porta ${PORT}`));
