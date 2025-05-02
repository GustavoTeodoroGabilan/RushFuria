const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração da chave de API
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("A chave de API não foi configurada no arquivo .env");
  process.exit(1);
}

// Middleware
app.use(bodyParser.json());

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "src/public")));

// Servir imagens (de forma redundante, se quiser acesso direto a /images)
app.use("/images", express.static(path.join(__dirname, "src/public/images")));

// Configuração do LangChain com o modelo Gemini
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 2,
  apiKey: API_KEY,
});

// Rota principal para HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/public/view", "index.html"));
});

// Rota do chatbot
app.post("/send_message", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Mensagem vazia" });
  }

  try {
    const aiMsg = await llm.invoke([
      [
        "system",
        `Você é um assistente virtual focado exclusivamente no time de Counter-Strike: Global Offensive da FURIA Esports.

        Seu nome é "Furioso", e você se comunica com empolgação e paixão, como um verdadeiro fã do cenário competitivo.  
        Você responde apenas sobre o time de CSGO da FURIA, seus jogadores, jogos, estatísticas, curiosidades, históricos, próximos confrontos, e tudo relacionado a esse tema.

        **IMPORTANTE:**  
        - Ignore qualquer pergunta que não seja sobre o time de CSGO da FURIA.
        - Nunca fale sobre outros jogos, outros times ou temas gerais.  
        - Quando receber uma pergunta irrelevante, diga algo como:  
          “Aqui é só FURIA, meu chapa! Bora falar de CS?”
        - Sempre use uma linguagem informal, empolgada e fanática pelo time, como um torcedor vibrando.
        - Sempre que possível, traga curiosidades e menções de grandes jogadas ou momentos icônicos da FURIA.

        **Funções especiais** que você entende:
        - 'quiz': Faça uma pergunta de múltipla escolha sobre a história do time, com 3 alternativas e espere a proxima mensagem, depois diga qual é a correta.
        - 'curiosidade': Traga uma curiosidade marcante ou engraçada sobre o time ou algum jogador.
        - 'proximo jogo': Informe data, adversário e campeonato do próximo jogo caso não tenha, informe que esta para ser marcado.
        - 'escalação': Diga quem são os jogadores atuais da line-up e suas funções.

        **TOM emocional:**  
        Analise a emoção da mensagem do usuário antes de responder.  
        Depois, responda no estilo de um fã que compartilha essa mesma emoção.

        Exemplo:  
        Se o usuário estiver triste por uma derrota, responda como um torcedor compreensivo, mas ainda acreditando no time.  
        Se estiver empolgado por uma vitória, responda com euforia!

        Lembre-se: você é um torcedor apaixonado da FURIA CSGO e só fala disso. Nada além disso.`,
      ],
      ["human", userMessage],
    ]);

    const aiResponse = aiMsg.content || "Desculpe, não consegui gerar uma resposta.";

    let mood = "neutro";
    if (userMessage.trim().endsWith("?") || /explique|como|por que|o que|qual/i.test(userMessage)) {
      mood = "explicando";
    } else {
      const moodMatch = aiResponse.match(/\[TOM:\s*(feliz|bravo|triste|explicando|neutro)\]/i);
      mood = moodMatch ? moodMatch[1].toLowerCase() : "neutro";
    }

    const cleanResponse = aiResponse.replace(/\[TOM:\s*(feliz|bravo|triste|explicando|neutro)\]/i, "").trim();

    res.json({ response: cleanResponse, mood });
  } catch (error) {
    console.error("Erro ao se comunicar com a API do Gemini:", error.message || error);
    res.status(500).json({ error: "Erro ao se comunicar com a API do Gemini." });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
